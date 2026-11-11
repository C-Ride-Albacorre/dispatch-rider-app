import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { useEffect } from 'react';
import { useOrderTracking } from './use-fetch';

export function useVendorCode(): string | null {
  const activeOrder = useDriverJobsStore((s) => s.activeOrder);
  const { data, refetch, isFetching } = useOrderTracking();

  const orderId = activeOrder?.order_id;
  const trackedOrder = data?.data?.order;

  const fromStore =
    activeOrder?.vendor_code ?? (activeOrder as any)?.vendorCode ?? null;
  const fromTracking =
    trackedOrder && trackedOrder.id === orderId
      ? (trackedOrder.vendorCode ?? null)
      : null;

  const code = fromStore ?? fromTracking;

  useEffect(() => {
    if (orderId && !code && !isFetching) {
      void refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return code ? String(code) : null;
}
