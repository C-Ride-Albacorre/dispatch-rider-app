import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  declineJobsService,
  deliveryJobsService,
  getOrderTrackingService,
  pickupJobsService,
} from './service';

// export function useActiveOrder() {
//   return useQuery({
//     queryKey: ['active-order'],
//     queryFn: async () => {
//       const res = await getActiveOrderService();

//       return res?.data ?? res?.order ?? res ?? null;
//     },
//     retry: 1,
//     staleTime: 10_000,
//   });
// }

export function useOrderTracking() {
  return useQuery({
    queryKey: ['order-tracking'],
    queryFn: () => getOrderTrackingService(),
    enabled: true,
    retry: 1,
    staleTime: 5_000,
  });
}

export function useDeclineJob() {
  const queryClient = useQueryClient();
  const clearActiveOrder = useDriverJobsStore((s) => s.clearActiveOrder);

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      declineJobsService({ orderId, reason }),

    onSuccess: () => {
      // Clear the active order from store
      clearActiveOrder();

      // Invalidate all related caches
      queryClient.invalidateQueries({
        queryKey: ['available-jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['available-job-details'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard-stats'],
      });

      // Invalidate active order tracking cache
      queryClient.invalidateQueries({
        queryKey: ['order-tracking'],
      });
    },
  });
}

export function usePickupJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId }: { orderId: string }) =>
      pickupJobsService({ orderId }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['available-jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['available-job-details'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard-stats'],
      });
    },
  });
}

export function useDeliveryJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, code }: { orderId: string; code: string }) =>
      deliveryJobsService({ orderId, code }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['available-jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['available-job-details'],
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard-stats'],
      });
    },
  });
}
