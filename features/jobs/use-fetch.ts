import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptJobsService,
  getAvailableJobsDetailsService,
} from './service';
export function useAvailableJobDetails({ orderId }: { orderId?: string }) {
  return useQuery({
    queryKey: ['available-job-details', orderId],
    queryFn: () => getAvailableJobsDetailsService(orderId!),
    enabled: !!orderId,
  });
}

export function useAcceptJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => acceptJobsService(orderId),

    onSuccess: () => {
      // Don't refetch now: the details screen is still open while it
      // dismisses, and an accepted order is no longer "available", so the
      // refetch 404s and shows an "Order not found" toast
      queryClient.invalidateQueries({
        queryKey: ['available-job-details'],
        refetchType: 'none',
      });

      queryClient.invalidateQueries({
        queryKey: ['dashboard-stats'],
      });
    },
  });
}
