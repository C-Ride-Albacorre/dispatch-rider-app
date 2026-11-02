import { useQuery } from '@tanstack/react-query';
import { getVehicleTypeConfigs } from './service';

export function useVehicleTypeConfigs() {
  return useQuery({
    queryKey: ['vehicle-type-configs'],
    queryFn: getVehicleTypeConfigs,
    staleTime: 1000 * 60 * 30,
  });
}
