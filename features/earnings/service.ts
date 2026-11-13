import { api } from '@/libs/api';
import { EarningsPeriod, EarningsRange } from './use-fetch';

export async function getEarningsDashboardService(
  period: EarningsPeriod,
  range?: EarningsRange,
) {
  const params =
    period === 'CUSTOM' && range
      ? { period, from: range.from, to: range.to }
      : { period };

  const response = await api.get('/driver/earnings/dashboard', { params });

  return response.data;
}
