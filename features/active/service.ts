import { api } from '@/libs/api';

export async function declineJobsService({
  orderId,
  reason,
}: {
  orderId: string;
  reason: string;
}) {
  console.log('Declining job with ID:', { orderId, reason });
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const response = await api.post(`/driver/${orderId}/decline`, { reason });

  return response.data;
}


export async function pickupJobsService({
  orderId,
}: {
  orderId: string;
}) {
  console.log('Picking up job with ID:', { orderId });
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const response = await api.post(`/driver/${orderId}/pickup`);

  return response.data;
}


export async function deliveryJobsService({
  orderId,
}: {
  orderId: string;
}) {
  console.log('Delivering job with ID:', { orderId });
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const response = await api.post(`/driver/${orderId}/deliver`);

  return response.data;
}
