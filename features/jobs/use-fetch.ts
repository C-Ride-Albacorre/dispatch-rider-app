import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptJobsService,
  getAvailableJobsDetailsService,
  getAvailableJobsService,
} from './service';
export function useAvailableJobs(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ['available-jobs', lat, lng],
    queryFn: () => getAvailableJobsService(lat!, lng!),
    enabled: !!lat && !!lng,
    refetchInterval: 30000,
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
    },
  });
}
