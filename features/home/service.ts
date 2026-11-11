import { api } from '@/libs/api';

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
  page,
  limit,
}: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const response = await api.get(`/driver/history`, {
    params: {
      status,
      page,
      limit,
    },
  });

  return response.data;
}

export async function getDeliveryDetailsService(orderId: string) {
  const response = await api.get(`/driver/history/${orderId}`);

  return response.data;

}