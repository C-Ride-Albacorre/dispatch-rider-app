import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import { useAuthStore } from '@/store/auth-store';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { useLocation } from './use-location';
import Toast from 'react-native-toast-message';

type DriverStatus = 'ONLINE' | 'OFFLINE' | 'BUSY';

export function useDriverSocket(status?: DriverStatus) {
  const token = useAuthStore((s) => s.accessToken);
  const driverId = useAuthStore((s) => s.driverId);

  const addOrder = useDriverJobsStore((s) => s.addOrder);
  const removeOrder = useDriverJobsStore((s) => s.removeOrder);
  const setSocket = useDriverJobsStore((s) => s.setSocket);
  const setActiveOrder = useDriverJobsStore((s) => s.setActiveOrder);

  const { location } = useLocation();

  const socketRef = useRef<Socket | null>(null);

  const ready =
    (status === 'ONLINE' || status === 'BUSY') && !!token && !!driverId;

  /**
   * SOCKET CONNECTION
   */
  useEffect(() => {
    if (!ready) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      return;
    }

    const socket = io('https://backend-service-1rc7.onrender.com/driver', {
      query: { driverId },
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    setSocket(socket);

    socket.on('connect', () => {
      console.log('✅ DRIVER SOCKET CONNECTED:', socket.id);

      // subscribe to assigned order room
      socket.emit('subscribe-assigned-orders', {
        driverId,
      });
    });

    socket.onAny((event, ...args) => {
      console.log('📡 EVENT:', event);
      console.log('📡 PAYLOAD:', args);
    });

    /**
     * NEW JOBS
     */
    socket.on('new-order-request', (order) => {
      console.log('📦 NEW ORDER:', order);
      addOrder(order);
    });

    /**
     * REMOVE JOB
     */
    socket.on('request-timeout', ({ orderId }) => {
      console.log('⏰ TIMEOUT:', orderId);
      removeOrder(orderId);
    });

    /**
     * ORDER TAKEN
     */
    socket.on('remove-order', (data) => {
      console.log('❌ REMOVE ORDER:', data);

      const { orderId, assignedDriverId } = data;

      removeOrder(orderId);

      if (assignedDriverId === driverId) {
        Toast.show({
          type: 'success',
          text1: 'You accepted this order!',
        });
      } else {
        Toast.show({
          type: 'info',
          text1: 'This order was taken by another driver.',
        });
      }
    });

    /**
     * ACTIVE ORDER (ONLY ONE)
     */
  socket.on('active-order', (payload) => {
  const activeOrder = payload?.order;

  if (!activeOrder) {
    console.log('⚠️ Ignoring null active-order payload');
    return;
  }

  setActiveOrder(activeOrder);

  useDriverJobsStore.getState().clearOrders();
});

    socket.on('connect_error', (err) => {
      console.log('❌ SOCKET ERROR:', err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [ready, token, driverId]);

  /**
   * DRIVER STATUS
   */

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) return;
    if (!socket.connected) return;
    if (!driverId || !status) return;

  
  

    socket.emit(
      'driver-status',
      {
        token,
        driverId,
        status,
      },
      (ack: any) => {
        console.log('📨 STATUS ACK:', ack);
      },
    );

    console.log('🟢 DRIVER STATUS SENT:', status);
  }, [status, driverId, token]);

  /**
   * LOCATION UPDATES
   */

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    if (!socket.connected) return;
    if (!location) return;
    if (!driverId) return;

  

    socket.emit(
      'driver-location',
      {
        driverId,
        lat: location.latitude,
        lng: location.longitude,
        heading: 0,
      },
      (ack: any) => {
        console.log('📨 LOCATION ACK:', ack);
      },
    );

    console.log('📍 LOCATION SENT:', {
      lat: location.latitude,
      lng: location.longitude,
    });
  }, [location, driverId, token]);
}
