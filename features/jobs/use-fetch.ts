import { useQuery } from '@tanstack/react-query';
import { getAvailableJobsService } from './service';
export function useAvailableJobs(
  lat?: number,
  lng?: number,
) {
  return useQuery({
    queryKey: ['available-jobs', lat, lng],
    queryFn: () => getAvailableJobsService(lat!, lng!),
    enabled: !!lat && !!lng,
    refetchInterval: 30000,
  });
}