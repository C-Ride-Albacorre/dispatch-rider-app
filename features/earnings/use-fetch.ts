import { useQuery } from '@tanstack/react-query';

import { getEarningsDashboardService } from './service';

export type EarningsPeriod = 'TODAY' | 'WEEK' | 'MONTH';

export interface EarningsWallet {
  availableBalance: number;
  pendingBalance: number;
  currency: string;
}

export interface EarningsSummary {
  totalEarnings: number;
  deliveries: number;
  tipsEarned: number;
  bonuses: number;
  onlineHours: number;
  avgEarningsPerHour: number;
}

export interface EarningsBreakdownDay {
  date: string;
  deliveries: number;
  earnings: number;
  onlineHours: number;
}

export interface EarningsDashboardData {
  period: {
    start: string;
    end: string;
    type: EarningsPeriod;
  };
  wallet: EarningsWallet;
  summary: EarningsSummary;
  breakdown: EarningsBreakdownDay[];
}

export function useEarningsDashboard(period: EarningsPeriod = 'TODAY') {
  return useQuery<EarningsDashboardData>({
    queryKey: ['earnings-dashboard', period],
    queryFn: async () => {
      const res = await getEarningsDashboardService(period);
      return res.data as EarningsDashboardData;
    },
  });
}

export function formatNaira(amount?: number) {
  return `NGN ${(amount ?? 0).toLocaleString()}`;
}

export function formatHours(hours?: number) {
  return `${Number((hours ?? 0).toFixed(1))}h`;
}
