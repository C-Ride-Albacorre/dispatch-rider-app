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
