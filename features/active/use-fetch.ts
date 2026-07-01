import { useMutation, useQueryClient } from "@tanstack/react-query";
import { declineJobsService, deliveryJobsService, pickupJobsService } from "./service";

export function useDeclineJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) => declineJobsService({ orderId, reason }),

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
    mutationFn: ({ orderId}: { orderId: string }) => pickupJobsService({ orderId }),

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
    mutationFn: ({ orderId}: { orderId: string }) => deliveryJobsService({ orderId }),

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

