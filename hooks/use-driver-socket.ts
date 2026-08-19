import { useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import { io, Socket } from 'socket.io-client';

import { useAuthStore } from '@/store/auth-store';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { useLocation } from './use-location';

type DriverStatus = 'ONLINE' | 'OFFLINE' | 'BUSY' | 'UNKNOWN';
const DEBUG_DRIVER_SOCKET = true;

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

function driverSocketLog(...args: unknown[]) {
  if (!DEBUG_DRIVER_SOCKET) return;

  console.log('[driver-socket]', ...args);
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

  const lastSentRef = useRef(0);

  const lastLocationRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const setSocket = useDriverJobsStore((s) => s.setSocket);
  const setActiveOrder = useDriverJobsStore((s) => s.setActiveOrder);
  const addOrder = useDriverJobsStore((s) => s.addOrder);
  const removeOrder = useDriverJobsStore((s) => s.removeOrder);
  const clearIncoming = useDriverJobsStore((s) => s.clearIncoming);

  const ready =
    (status === 'ONLINE' || status === 'BUSY') && !!token && !!driverId;

  /**
   * SOCKET SETUP
   */
  useEffect(() => {
    driverSocketLog('effect run', {
      ready,
      hasToken: !!token,
      driverId,
      status,
      alreadyInitialized: hasInitialized.current,
    });

    if (!ready) {
      driverSocketLog('not ready -> disconnecting current socket');
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      hasInitialized.current = false;
      return;
    }

    if (hasInitialized.current) {
      driverSocketLog('skip init: already initialized');
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

    driverSocketLog('socket created', { driverId });

    socket.on('connect_error', (err) => {
      driverSocketLog('connect_error', err?.message ?? err);
    });

    socket.on('disconnect', (reason) => {
      driverSocketLog('disconnect', { reason });
    });

    socket.on('connect', () => {
      driverSocketLog('connected', { socketId: socket.id, driverId });

      if (location) {
        socket.emit('driver-location', {
          driverId,
          orderId: activeOrderId,
          lat: location.latitude,
          lng: location.longitude,
          heading: location.heading,
        });
      }

      driverSocketLog('emit subscribe-assigned-orders', { driverId });
      socket.emit('subscribe-assigned-orders', { driverId }, (ack: unknown) => {
        driverSocketLog('subscribe-assigned-orders ack', ack);

        const order = extractOrder(ack);

        driverSocketLog('order extracted from ack', {
          hasOrder: !!order,
          orderId: order?.order_id ?? null,
        });

        if (!order) return;

        setActiveOrder(order);
        // Only clear incoming orders if we have an active order (user accepted a job)
        // Don't clear on every reconnect as it causes race conditions
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

    socket.on('new-order-request', (order) => {
      const orderId = order?.order_id ?? order?.orderId;

      driverSocketLog('new-order-request', {
        orderId,
        hasOrderId: !!orderId,
        driverStatus: status,
        orderData: order,
      });

      if (!orderId) {
        console.warn('[driver-socket] Received order without ID:', order);
        return;
      }

      // Don't accept jobs if status is OFFLINE or UNKNOWN
      // if (status === 'OFFLINE' || status === 'UNKNOWN') {
      //   driverSocketLog('rejecting order: driver status is', status);
      //   return;
      // }

      addOrder(order);
    });

    socket.on('request-timeout', ({ orderId }) => {
      removeOrder(orderId);
    });

    socket.on('remove-order', (data) => {
      const { orderId, assignedDriverId } = data;

      driverSocketLog('remove-order', {
        orderId,
        assignedDriverId,
        currentDriverId: driverId,
      });

      removeOrder(orderId);

      // Only clear incoming if this job was assigned to current driver
      if (assignedDriverId === driverId) {
        clearIncoming();
      }
    });

    socket.on('active-order', (payload) => {
      driverSocketLog('active-order payload', payload);

      // Don't accept active orders if status is OFFLINE or UNKNOWN
      // if (status === 'OFFLINE' || status === 'UNKNOWN') {
      //   driverSocketLog('rejecting active order: driver status is', status);
      //   return;
      // }

      const order = extractOrder(payload);
      driverSocketLog('active-order extracted', {
        hasOrder: !!order,
        orderId: order?.order_id ?? null,
      });

      if (!order) return;

      setActiveOrder(order);
      clearIncoming();
    });

    socket.on('driver-arrived', (data) => {
      driverSocketLog('driver-arrived', data);

      const { leg } = data;

      if (leg === 'to-vendor') {
        console.log('[VENDOR ARRIVAL] 🏪 Driver arrived at vendor:', {
          timestamp: new Date().toISOString(),
          fullResponse: data,
          leg,
        });
        Toast.show({
          type: 'success',
          text1: 'Driver Arrived',
          text2: 'Driver has arrived at the vendor',
          // duration: 3000,
        });
      } else if (leg === 'to-customer') {
        console.log('[CUSTOMER ARRIVAL] 📍 Driver arrived at customer:', {
          timestamp: new Date().toISOString(),
          fullResponse: data,
          leg,
        });
        Toast.show({
          type: 'success',
          text1: 'Driver Arrived',
          text2: 'Driver has arrived at your location',
          // duration: 3000,
        });
      }
    });

    return () => {
      driverSocketLog('cleanup -> disconnect socket');
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
    addOrder,
    removeOrder,
    clearIncoming,
  ]);

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

    driverSocketLog('emit driver-location', {
      driverId,
      orderId: activeOrderId,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    socket.emit(
      'driver-location',
      {
        driverId,
        orderId: activeOrderId,
        lat: location.latitude,
        lng: location.longitude,
        heading: location.heading,
      },
      (ack: unknown) => {
        driverSocketLog('driver-location ack', ack);
      },
    );
  }, [location, activeOrderId, driverId]);
}
