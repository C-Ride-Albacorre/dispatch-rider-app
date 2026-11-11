import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getDashboardStatsService,
  getDeliveryDetailsService,
  getRecentDeliveriesService,
  updateDriverStatusService,
} from './service';

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

export interface RecentDelivery {
  assignmentId: string;
  orderId: string;
  orderNumber: string;
  orderCode: string;
  vendorCode?: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  deliveryFee: number;
  deliveredAt: string | null;
  createdAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    profilePicture: string | null;
  };
  stores: {
    id: string;
    storeName: string;
    storeLogo: string;
    phoneNumber: string;
    address: string;
  }[];

  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: {
      id: string;
      productName: string;
      image: string;
    };
    variant: string | null;
  }[];
}

export interface RecentDeliveriesResponse {
  data: RecentDelivery[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type DeliveryHistoryStatus = 'DELIVERED' | 'PICKED_UP' | 'CANCELLED';

export function useDashboardStats() {
  return useQuery<DashboardApiData>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await getDashboardStatsService();
      return res.data as DashboardApiData;
    },
    // refetchInterval: 30000,
  });
}

export function useUpdateDriverStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: 'ONLINE' | 'OFFLINE') =>
      updateDriverStatusService(status),

    onSuccess: (_, status) => {
      queryClient.invalidateQueries({
        queryKey: ['dashboard-stats'],
      });
    },
  });
}

// export function useRecentDeliveries() {
//   return useInfiniteQuery<RecentDeliveriesResponse>({
//     queryKey: ['recent-deliveries'],

//     queryFn: async ({ pageParam }) => {
//       const page = Number(pageParam);

//       if (!Number.isFinite(page)) {
//         throw new Error(
//           `Invalid pagination page: ${pageParam}`,
//         );
//       }

//       return getRecentDeliveriesService({
//         status: 'DELIVERED',
//         page,
//         limit: 10,
//       });
//     },

//     initialPageParam: 1,

//     getNextPageParam: (lastPage) => {
//       const currentPage = Number(lastPage.page);
//       const totalPages = Number(
//         lastPage.totalPages,
//       );

//       if (
//         !Number.isFinite(currentPage) ||
//         !Number.isFinite(totalPages)
//       ) {
//         return undefined;
//       }

//       if (
//         currentPage >= totalPages
//       ) {
//         return undefined;
//       }

//       return currentPage + 1;
//     },

//     refetchInterval: 30000,
//   });
// }

export const RECENT_DELIVERIES_LIMIT = 5;
export const DELIVERY_HISTORY_PAGE_SIZE = 20;

export function useRecentDeliveries(limit = RECENT_DELIVERIES_LIMIT) {
  return useQuery<RecentDeliveriesResponse>({
    queryKey: ['recent-deliveries', limit],
    queryFn: async () => {
      const res = await getRecentDeliveriesService({
        status: 'DELIVERED',
        page: 1,
        limit,
      });
      return res.data as RecentDeliveriesResponse;
    },
    refetchInterval: 30000,
  });
}

export function useDeliveryHistory(status?: DeliveryHistoryStatus) {
  return useInfiniteQuery<RecentDeliveriesResponse>({
    queryKey: ['delivery-history', status ?? 'ALL'],
    queryFn: async ({ pageParam }) => {
      const res = await getRecentDeliveriesService({
        status,
        page: Number(pageParam),
        limit: DELIVERY_HISTORY_PAGE_SIZE,
      });
      return res.data as RecentDeliveriesResponse;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const page = Number(lastPage?.page);
      const totalPages = Number(lastPage?.totalPages);

      if (!Number.isFinite(page) || !Number.isFinite(totalPages)) {
        return undefined;
      }

      return page < totalPages ? page + 1 : undefined;
    },
  });
}

export function useDeliveryDetails(orderId: string) {
  return useQuery({
    queryKey: ['delivery-details', orderId],
    queryFn: () => getDeliveryDetailsService(orderId),
    enabled: !!orderId,
    staleTime: 10_000,
  });
}
