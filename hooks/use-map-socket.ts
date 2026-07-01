import { useAuthStore } from '@/store/auth-store';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type RawMapPayload = Record<string, any> | null | undefined;

function unwrapPayload(payload: unknown): RawMapPayload {
  const first = Array.isArray(payload) ? payload[0] : payload;

  if (!first || typeof first !== 'object') return null;

  const data = (first as Record<string, any>).data;

  if (data && typeof data === 'object') return data as RawMapPayload;

  return first as RawMapPayload;
}

function normalizeLeg(leg: unknown): 'to-vendor' | 'to-customer' | null {
  if (typeof leg !== 'string') return null;

  const normalized = leg.toLowerCase().replace(/[_\s]/g, '-');

  if (normalized === 'to-vendor' || normalized === 'vendor') {
    return 'to-vendor';
  }

  if (normalized === 'to-customer' || normalized === 'customer') {
    return 'to-customer';
  }

  return null;
}

export function useMapSocket(orderId?: string) {
  const token = useAuthStore((s) => s.accessToken);

  const setOrderStatus = useDriverJobsStore((s) => s.setOrderStatus);

  const setDriverLocation = useDriverJobsStore((s) => s.setDriverLocation);

  const setEta = useDriverJobsStore((s) => s.setEta);

  const setPolyline = useDriverJobsStore((s) => s.setPolyline);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!orderId || !token) return;

    const socket = io('https://backend-service-1rc7.onrender.com/map', {
      query: { orderId },
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🗺 MAP SOCKET CONNECTED:', socket.id);

      console.log('📦 SUBSCRIBING TO ORDER:', orderId);

      console.log('📦 ACCESS TOKEN:', token);

      socket.emit('subscribe-order', orderId);
    });

    socket.onAny((event, ...args) => {
      console.log('🗺 MAP EVENT:', event);
      console.log('🗺 MAP PAYLOAD:', args);
    });

    socket.on('order-status', (payload) => {
      const data = unwrapPayload(payload);
      const status =
        data?.status ?? data?.orderStatus ?? data?.order_status ?? null;

      setOrderStatus(typeof status === 'string' ? status : null);
    });

    socket.on('driver-location', (payload) => {
      const data = unwrapPayload(payload);

      const lat = Number(data?.lat ?? data?.latitude);
      const lng = Number(data?.lng ?? data?.lon ?? data?.longitude);
      const headingValue = data?.heading;

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return;
      }

      setDriverLocation({
        lat,
        lng,
        heading:
          typeof headingValue === 'number' && Number.isFinite(headingValue)
            ? headingValue
            : undefined,
      });
    });

    socket.on('eta-update', (payload) => {
      const data = unwrapPayload(payload);
      const leg = normalizeLeg(data?.leg);

      if (!leg) return;

      const etaRaw = data?.etaSeconds ?? data?.eta ?? null;
      const eta = etaRaw == null ? null : Number(etaRaw);

      setEta(leg, Number.isFinite(eta as number) ? (eta as number) : null);
    });

    socket.on('polyline-update', (payload) => {
      const data = unwrapPayload(payload);
      const leg = normalizeLeg(data?.leg);
      const encoded = data?.polyline ?? data?.encodedPolyline ?? null;

      if (!leg || typeof encoded !== 'string') return;

      setPolyline(leg, encoded);
    });

    socket.on('disconnect', () => {
      console.log('❌ MAP SOCKET DISCONNECTED');
    });

    socket.on('connect_error', (err) => {
      console.log('❌ MAP SOCKET ERROR:', err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [orderId, token]);
}
