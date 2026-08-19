import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptJobsService,
  getAvailableJobsDetailsService,
  getAvailableJobsService,
} from './service';
export function useAvailableJobs(
  lat?: number,
  lng?: number,
  options?: {
    enabled?: boolean;
  },
) {
  const enabled =
    lat !== undefined && lng !== undefined && options?.enabled !== false;

  return useQuery({
    queryKey: ['available-jobs'],

    queryFn: () => getAvailableJobsService(lat!, lng!),

    enabled,

    // No continuous polling - rely on socket events for real-time updates
    // Only refetch on manual trigger (pull-to-refresh, status change, etc)
    refetchInterval: false,

    // Don't refetch simply because the component mounts again
    refetchOnMount: false,

    // Don't refetch when the app/window gets focus
    refetchOnWindowFocus: false,

    // Don't automatically refetch when network reconnects
    refetchOnReconnect: false,
  });
}

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
