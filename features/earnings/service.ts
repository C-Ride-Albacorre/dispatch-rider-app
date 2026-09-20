import { api } from '@/libs/api';
import { EarningsPeriod } from './use-fetch';

export async function getEarningsDashboardService(period: EarningsPeriod) {
  const response = await api.get('/driver/earnings/dashboard', {
    params: { period },
  });

  return response.data;
}
