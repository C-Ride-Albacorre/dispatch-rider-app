import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getDashboardStatsService, updateDriverStatusService } from './service';

export interface DashboardProfile {
  id: string;
  vehicleType: string;
  vehicleMake: string;
  vehicleModel: string;
  year: number;
  licensePlate: string;
  rating: number;
  ratingCount: number;
  totalDeliveries: number;
  status: string;
}

export interface DashboardPersonalInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImage: string | null;
  countryCode: string | null;
  createdAt: string;
  active: boolean;
  verifiedAt: string | null;
  approvedAt: string | null;
}

export interface DashboardStats {
  totalDeliveries: number;
  rating: number;
  status: 'ONLINE' | 'OFFLINE';
}

export interface DashboardApiData {
  profile: DashboardProfile;
  personalInfo: DashboardPersonalInfo;
  stats: DashboardStats;
}

export function useDashboardStats() {
  return useQuery<DashboardApiData>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await getDashboardStatsService();
      return res.data as DashboardApiData;
    },
  });
}

export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: 'ONLINE' | 'OFFLINE') =>
      updateDriverStatusService(status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dashboard-stats'],
      });
    },
  });
}
