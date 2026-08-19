import { api } from '@/libs/api';
import { DeliveryHistoryStatus } from './use-fetch';

export async function getDashboardStatsService() {
  const response = await api.get('/driver/dashboard');

  return response.data;
}

export async function updateDriverStatusService(status: 'ONLINE' | 'OFFLINE') {
  const response = await api.post('/driver/status', {
    status,
  });

  return response.data;
}

export async function getRecentDeliveriesService({
  status,

}: {
  status: string;

}) {
  const response = await api.get(`/driver/history`, {
    params: {
      status,
    
    },
  });

  return response.data;
}

export async function getDeliveryDetailsService(orderId: string) {
  const response = await api.get(`/driver/history/${orderId}`);

  console.log('[getDeliveryDetailsService] response:', response.data);

  return response.data;

}