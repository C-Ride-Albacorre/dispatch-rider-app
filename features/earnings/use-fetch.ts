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
  return `₦ ${(amount ?? 0).toLocaleString()}`;
}

const COMPACT_UNITS = [
  { value: 1e9, suffix: 'B' },
  { value: 1e6, suffix: 'M' },
  { value: 1e3, suffix: 'k' },
];

/**
 * Short naira amount for tight tiles: ₦ 950, ₦ 1.5k, ₦ 100k, ₦ 1.2M.
 * Use formatNaira wherever the exact figure matters.
 */
export function formatNairaCompact(amount?: number) {
  const value = amount ?? 0;
  const abs = Math.abs(value);

  for (const [i, unit] of COMPACT_UNITS.entries()) {
    if (abs < unit.value) continue;

    const scaled = Number((abs / unit.value).toFixed(1));

    // 999,950 rounds to "1000k"; show it as the next unit up instead
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
