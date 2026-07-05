import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import { useAuthStore } from '@/store/auth-store';
import { useDriverJobsStore } from '@/store/driver-jobs-store';

const DEBUG_MAP_SOCKET = true;

function mapSocketLog(...args: unknown[]) {
  if (!DEBUG_MAP_SOCKET) return;

  console.log('[map-socket]', ...args);
}

function unwrapSocketPayload(payload: unknown): Record<string, any> | null {
  const first = Array.isArray(payload) ? payload[0] : payload;

  if (!first || typeof first !== 'object') return null;

  const data = (first as Record<string, any>).data;

  if (data && typeof data === 'object') return data as Record<string, any>;

  return first as Record<string, any>;
}

export function useMapSocket(orderId?: string) {
  const token = useAuthStore((s) => s.accessToken);

  const setOrderStatus = useDriverJobsStore((s) => s.setOrderStatus);
  const setDriverLocation = useDriverJobsStore((s) => s.setDriverLocation);
  const setEta = useDriverJobsStore((s) => s.setEta);
  const setPolyline = useDriverJobsStore((s) => s.setPolyline);
  const clearTracking = useDriverJobsStore((s) => s.clearTracking);

  const socketRef = useRef<Socket | null>(null);
  const lastOrderId = useRef<string | null>(null);

  useEffect(() => {
    mapSocketLog('effect run', {
      orderId,
      hasToken: !!token,
      lastOrderId: lastOrderId.current,
      currentlyConnected: !!socketRef.current?.connected,
    });

if (!orderId || !token) {
  socketRef.current?.disconnect();
  socketRef.current = null;
  lastOrderId.current = null;
  clearTracking();

  mapSocketLog('No active order. Socket disconnected.');

  return;
}

    /**
     * IMPORTANT:
     * prevent reconnecting for same order
     */
    // if (lastOrderId.current === orderId && socketRef.current?.connected) {
    //   mapSocketLog('skip reconnect: already connected for same order', {
    //     orderId,
    //   });
    //   return;
    // }

    mapSocketLog('disconnect previous socket before reconnect', {
      previousOrderId: lastOrderId.current,
      nextOrderId: orderId,
    });
    socketRef.current?.disconnect();

    lastOrderId.current = orderId;

    const socket = io('https://backend-service-1rc7.onrender.com/map', {
      query: { orderId },
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect_error', (err) => {
      mapSocketLog('connect_error', err?.message ?? err);
    });

    socket.on('disconnect', (reason) => {
      mapSocketLog('disconnect', { reason, orderId });
    });

    socket.on('connect', () => {
      mapSocketLog('connected', { socketId: socket.id, orderId });

      mapSocketLog('emit subscribe-order', { orderId });
      socket.emit('subscribe-order', orderId);
    });

    /**
     * ORDER STATUS (FIXED)
     */
    socket.on('order-status', (payload) => {
      const data = Array.isArray(payload)
        ? (payload[0]?.data ?? payload[0])
        : (payload?.data ?? payload);

      const status = data?.status ?? data?.orderStatus ?? data?.order_status;

      mapSocketLog('order-status', {
        status,
      });

      if (typeof status === 'string') {
        setOrderStatus(status);

        if (status === 'PICKED_UP') {
          // optional cleanup
        }

        if (status === 'DELIVERED') {
          clearTracking();
        }
      }
    });

    /**
     * DRIVER LOCATION
     */
    socket.on('driver-location', (payload) => {
      const data = Array.isArray(payload)
        ? (payload[0]?.data ?? payload[0])
        : (payload?.data ?? payload);

      const lat = Number(data?.lat ?? data?.latitude);
      const lng = Number(data?.lng ?? data?.longitude);

      mapSocketLog('driver-location', {
        hasCoordinates: Number.isFinite(lat) && Number.isFinite(lng),
      });

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      setDriverLocation({
        lat,
        lng,
        heading: data?.heading,
      });
    });

    /**
     * ETA
     */
    socket.on('eta-update', (payload) => {
      const data = unwrapSocketPayload(payload);

      if (!data) return;

      const leg = data?.leg === 'to-vendor' ? 'vendor' : 'customer';

      const eta = Number(data?.etaSeconds ?? data?.eta);

      mapSocketLog('eta-update', { leg, eta });

      if (Number.isFinite(eta)) {
        setEta(leg, eta);
      }
    });

    /**
     * POLYLINE
     */
    socket.on('polyline-update', (payload) => {
      const data = unwrapSocketPayload(payload);

      if (!data) return;

      const leg = data?.leg === 'to-vendor' ? 'vendor' : 'customer';

      const polyline = data?.polyline ?? data?.encodedPolyline;

      mapSocketLog('polyline-update', {
        leg,
        hasPolyline: typeof polyline === 'string' && polyline.length > 0,
      });

      if (typeof polyline === 'string') {
        setPolyline(leg, polyline);
      }
    });

   return () => {
  mapSocketLog('cleanup -> disconnect socket', { orderId });

  socket.disconnect();

  socketRef.current = null;
  lastOrderId.current = null;
};
  }, [ orderId,
  token,
  setOrderStatus,
  setDriverLocation,
  setEta,
  setPolyline,
  clearTracking,]);
}
