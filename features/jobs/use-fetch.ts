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
