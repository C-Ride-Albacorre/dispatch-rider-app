import { useSocket } from '@/app/providers/socket-provider';
import { getSocket } from '@/services/socket/driver';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { useEffect } from 'react';

export function useDriverSocket(enabled: boolean) {
  const socket = useSocket();

  const addOrder = useDriverJobsStore((s) => s.addOrder);

  const removeOrder = useDriverJobsStore((s) => s.removeOrder);

  const clearOrders = useDriverJobsStore((s) => s.clearOrders);

  useEffect(() => {
    if (!enabled) {
      clearOrders();
    }

    if (!enabled || !socket) return;

    const handleNewOrder = (payload: any) => {
      console.log('NEW ORDER REQUEST', payload);

      addOrder(payload);
    };

    const handleTimeout = (payload: any) => {
      console.log('ORDER REQUEST TIMEOUT', payload);

      removeOrder(payload.orderId);
    };

    socket.on('new-order-request', handleNewOrder);

    socket.on('request-timeout', handleTimeout);

    return () => {
      socket.off('new-order-request', handleNewOrder);

      socket.off('request-timeout', handleTimeout);
    };
  }, [socket, enabled]);
}
