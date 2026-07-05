import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import { useAuthStore } from '@/store/auth-store';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { useLocation } from './use-location';

type DriverStatus = 'ONLINE' | 'OFFLINE' | 'BUSY';
const DEBUG_DRIVER_SOCKET = true;

type SocketPayload = Record<string, any> | null | undefined;

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

  const locationRef = useRef<{ latitude: number; longitude: number } | null>(
    null,
  );
  const lastSentRef = useRef<number>(0);

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
        clearIncoming();
      });
    });

    socket.io.on('reconnect', () => {
      driverSocketLog('reconnected');

      socket.emit('subscribe-assigned-orders', { driverId });
    });

    socket.on('new-order-request', (order) => {
      driverSocketLog('new-order-request', {
        orderId: order?.order_id ?? order?.orderId ?? null,
      });

      addOrder(order);
    });

    socket.on('request-timeout', ({ orderId }) => {
      removeOrder(orderId);
    });

    socket.on('remove-order', (data) => {
      const { orderId, assignedDriverId } = data;

      removeOrder(orderId);

      if (assignedDriverId === driverId) {
        clearIncoming();
      }
    });

    socket.on('active-order', (payload) => {
      driverSocketLog('active-order payload', payload);

      const order = extractOrder(payload);
      driverSocketLog('active-order extracted', {
        hasOrder: !!order,
        orderId: order?.order_id ?? null,
      });

      if (!order) return;

      setActiveOrder(order);
      clearIncoming();
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
    setSocket,
    setActiveOrder,
    addOrder,
    removeOrder,
    clearIncoming,
  ]);

  /**
   * LOCATION SOURCE
   */
  const { location } = useLocation();

  useEffect(() => {
    if (!location) return;

    locationRef.current = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
  }, [location]);

  /**
   * LOCATION EMITTER (STABLE + SAFE)
   */
  useEffect(() => {
    // Don't start emitting until we have an activeOrderId
    if (!activeOrderId) return;

    const interval = setInterval(() => {
      const socket = socketRef.current;
      const loc = locationRef.current;

      if (!socket?.connected) return;
      if (!driverId) return;
      if (!loc) return;

      const now = Date.now();

      // throttle (important)
      if (now - lastSentRef.current < 2000) return;
      lastSentRef.current = now;

      driverSocketLog('emitting driver-location', {
        driverId,
        orderId: activeOrderId,
        lat: loc.latitude,
        lng: loc.longitude,
      });

      console.log('📨 DRIVER LOCATION:', {
        driverId,
        lat: loc.latitude,
        lng: loc.longitude,
        orderId: activeOrderId,
        heading: 0,
      });

      socket.emit(
        'driver-location',
        {
          driverId,
          lat: loc.latitude,
          lng: loc.longitude,
          orderId: activeOrderId,
          heading: 0,
        },
        (ack: any) => {
          console.log('📨 LOCATION ACK:', ack);
        },
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [driverId, activeOrderId]);
}
