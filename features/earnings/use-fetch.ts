import { useQuery } from '@tanstack/react-query';

import { getEarningsDashboardService } from './service';

export type EarningsPeriod = 'TODAY' | 'WEEK' | 'MONTH' | 'CUSTOM';

/** ISO 8601 UTC bounds, required when period is CUSTOM. */
export interface EarningsRange {
  from: string;
  to: string;
}

export interface EarningsWallet {
  availableBalance: number;
  pendingBalance: number;
  currency: string;
  totalOnCard: number;
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

export interface EarningsPerformance {
  /** Currently always "lifetime": these rates ignore the selected period. */
  scope: string;
  acceptanceRate: number;
  completionRate: number;
  onTimeRate: number;
  counts: {
    offered: number;
    accepted: number;
    declined: number;
    expired: number;
    completed: number;
    onTime: number;
  };
}

export interface EarningsDashboardData {
  period: {
    start: string;
    end: string;
    type: EarningsPeriod;
  };
  wallet: EarningsWallet;
  summary: EarningsSummary;
  performance?: EarningsPerformance;
  breakdown: EarningsBreakdownDay[];
}

export function useEarningsDashboard(
  period: EarningsPeriod = 'TODAY',
  range?: EarningsRange,
) {
  return useQuery<EarningsDashboardData>({
    queryKey: ['earnings-dashboard', period, range?.from, range?.to],
    queryFn: async () => {
      const res = await getEarningsDashboardService(period, range);
      return res.data as EarningsDashboardData;
    },
    // The backend rejects CUSTOM without from/to.
    enabled: period !== 'CUSTOM' || !!range,
  });
}

export function formatNaira(amount?: number) {
  return `₦ ${(amount ?? 0).toLocaleString()}`;
}

const COMPACT_UNITS = [
  { value: 1e9, suffix: 'B' },
  { value: 1e6, suffix: 'M' },
  { value: 1e3, suffix: 'k' },
];

export function formatNairaCompact(amount?: number) {
  const value = amount ?? 0;
  const abs = Math.abs(value);

  for (const [i, unit] of COMPACT_UNITS.entries()) {
    if (abs < unit.value) continue;

    const scaled = Number((abs / unit.value).toFixed(1));

    const bigger = COMPACT_UNITS[i - 1];
    const text =
      scaled >= 1000 && bigger ? `1${bigger.suffix}` : `${scaled}${unit.suffix}`;

    return `₦ ${value < 0 ? '-' : ''}${text}`;
  }

  return formatNaira(value);
}

export function formatHours(hours?: number) {
  return `${Number((hours ?? 0).toFixed(1))}h`;
}
