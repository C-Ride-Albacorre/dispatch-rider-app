import { useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import { io, Socket } from 'socket.io-client';

import { useAuthStore } from '@/store/auth-store';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { useLocation } from './use-location';

type DriverStatus = 'ONLINE' | 'OFFLINE' | 'BUSY' | 'UNKNOWN';

type SocketPayload = Record<string, any> | null | undefined;

function distanceInMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) {
  const R = 6371000;

  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const dLat =
    ((b.latitude - a.latitude) * Math.PI) / 180;

  const dLng =
    ((b.longitude - a.longitude) * Math.PI) / 180;

  const x =
    dLng * Math.cos((lat1 + lat2) / 2);

  const y = dLat;

  return Math.sqrt(x * x + y * y) * R;
}

function unwrapSocketPayload(payload: unknown): SocketPayload {
  const first = Array.isArray(payload) ? payload[0] : payload;

  if (!first || typeof first !== 'object') return null;

  const data = (first as Record<string, any>).data;

  if (data && typeof data === 'object') return data as SocketPayload;

  return first as SocketPayload;
}

function extractOrder(payload: unknown) {
  const data = unwrapSocketPayload(payload);

  return (
    data?.order ??
    data?.activeOrder ??
    data?.currentOrder ??
    data?.assignedOrder ??
    null
  );
}

export function useDriverSocket(
  status?: DriverStatus,
  activeOrderId?: string | null,
) {
  const token = useAuthStore((s) => s.accessToken);
  const driverId = useAuthStore((s) => s.driverId);

  const socketRef = useRef<Socket | null>(null);
  const hasInitialized = useRef(false);

  const { location } = useLocation();

  const locationRef = useRef(location);
  locationRef.current = location;

  const pendingSyncRef = useRef(false);

  const lastSentRef = useRef(0);

  const lastLocationRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const setSocket = useDriverJobsStore((s) => s.setSocket);
  const setActiveOrder = useDriverJobsStore((s) => s.setActiveOrder);
  const setOrders = useDriverJobsStore((s) => s.setOrders);
  const addOrders = useDriverJobsStore((s) => s.addOrders);
  const removeOrder = useDriverJobsStore((s) => s.removeOrder);
  const clearIncoming = useDriverJobsStore((s) => s.clearIncoming);

  const ready =
    (status === 'ONLINE' || status === 'BUSY') && !!token && !!driverId;

  /**
   * SOCKET SETUP
   */
  useEffect(() => {
    if (!ready) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      hasInitialized.current = false;
      return;
    }

    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    const socket = io('https://backend-service-1rc7.onrender.com/driver', {
      query: { driverId },
      auth: { token },
      transports: ['websocket'],

      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;
    setSocket(socket);

    socket.on('connect', () => {
      const current = locationRef.current;

      if (current) {
        socket.emit('driver-location', {
          driverId,
          orderId: activeOrderId,
          lat: current.latitude,
          lng: current.longitude,
          heading: current.heading,
        });

        socket.emit('request-sync', {
          lat: current.latitude,
          lng: current.longitude,
        });
      } else {
        pendingSyncRef.current = true;
      }

      socket.emit('subscribe-assigned-orders', { driverId }, (ack: unknown) => {
        const order = extractOrder(ack);

        if (!order) return;

        setActiveOrder(order);
        if (order?.order_id) {
          clearIncoming();
        }
      });
    });

    socket.io.on('reconnect', () => {
      socket.emit('subscribe-assigned-orders', {
        driverId,
      });
    });

    socket.on('sync-orders', (payload) => {
      const orders = payload?.orders ?? [];

      setOrders(orders);
    });

    socket.on('new-order-request', (payload) => {
      const orders = payload?.orders ?? [];

      addOrders(orders);
    });

    socket.on('order-removed', (payload) => {
      removeOrder(payload?.order_id);
    });

    socket.on('request-timeout', (data) => {
      removeOrder(data?.orderId ?? data?.order_id);
    });

    socket.on('active-order', (payload) => {
      // if (status === 'OFFLINE' || status === 'UNKNOWN') {
      //   driverSocketLog('rejecting active order: driver status is', status);
      //   return;
      // }

      const order = extractOrder(payload);

      if (!order) return;

      setActiveOrder(order);
      clearIncoming();
    });

    socket.on('driver-arrived', (data) => {
      const { leg } = data;

      if (leg === 'to-vendor') {
        Toast.show({
          type: 'success',
          text1: 'Driver Arrived',
          text2: 'Driver has arrived at the vendor',
          // duration: 3000,
        });
      } else if (leg === 'to-customer') {
        Toast.show({
          type: 'success',
          text1: 'Driver Arrived',
          text2: 'Driver has arrived at your location',
          // duration: 3000,
        });
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setSocket(null);
      hasInitialized.current = false;
    };
  }, [
    ready,
    token,
    driverId,
    activeOrderId,
    setSocket,
    setActiveOrder,
    setOrders,
    addOrders,
    removeOrder,
    clearIncoming,
  ]);

  /**
   * FIRST FIX AFTER CONNECT
   */
  useEffect(() => {
    if (!location || !pendingSyncRef.current) return;

    const socket = socketRef.current;

    if (!socket?.connected) return;

    pendingSyncRef.current = false;


    socket.emit('driver-location', {
      driverId,
      orderId: activeOrderId,
      lat: location.latitude,
      lng: location.longitude,
      heading: location.heading,
    });

    socket.emit('request-sync', {
      lat: location.latitude,
      lng: location.longitude,
    });
  }, [location, activeOrderId, driverId]);

  /**
   * LOCATION EMITTER (STABLE + SAFE)
   */
  useEffect(() => {
    if (!location) return;

    if (!activeOrderId) return;

    const socket = socketRef.current;

    if (!socket?.connected) return;

    if (!driverId) return;

    const now = Date.now();

    if (now - lastSentRef.current < 1000) {
      return;
    }

    lastSentRef.current = now;

    const previous = lastLocationRef.current;

   if (previous) {
  const moved = distanceInMeters(
    previous,
    {
      latitude: location.latitude,
      longitude: location.longitude,
    },
  );

  if (moved < 5) {
    return;
  }
}
    lastLocationRef.current = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    socket.emit(
      'driver-location',
      {
        driverId,
        orderId: activeOrderId,
        lat: location.latitude,
        lng: location.longitude,
        heading: location.heading,
      },
    );
  }, [location, activeOrderId, driverId]);
}
