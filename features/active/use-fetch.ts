import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  declineJobsService,
  deliveryJobsService,
  getActiveOrderService,
  getOrderTrackingService,
  pickupJobsService,
} from './service';

export function useActiveOrder() {
  return useQuery({
    queryKey: ['active-order'],
    queryFn: async () => {
      const res = await getActiveOrderService();

      return res?.data ?? res?.order ?? res ?? null;
    },
    retry: 1,
    staleTime: 10_000,
  });
}

export function useOrderTracking(orderId: string | undefined | null) {
  return useQuery({
    queryKey: ['order-tracking', orderId],
    queryFn: () => getOrderTrackingService(orderId!),
    enabled: !!orderId,
    retry: 1,
    staleTime: 5_000,
  });
}

export function useDeclineJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      declineJobsService({ orderId, reason }),

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
    mutationFn: ({ orderId }: { orderId: string }) =>
      deliveryJobsService({ orderId }),

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
