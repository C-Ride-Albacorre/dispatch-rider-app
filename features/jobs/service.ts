import { api } from '@/libs/api';

export async function getAvailableJobsDetailsService(orderId: string) {
  const response = await api.get(`/driver/available-order/${orderId}`);

  return response.data;
}

export async function acceptJobsService(orderId: string) {
if (!orderId) {
    throw new Error('Order ID is required');
  }


  const response = await api.post(`/driver/${orderId}/accept`);

  return response.data;
}
