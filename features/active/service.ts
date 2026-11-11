import { api } from '@/libs/api';

// export async function getActiveOrderService() {
//   const response = await api.get('/driver/active-order');

//   return response.data;
// }

export async function getOrderTrackingService() {
  const response = await api.get(`/driver/tracking`);

  
  return response.data;

}

export async function declineJobsService({
  orderId,
  reason,
}: {
  orderId: string;
  reason: string;
}) {
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const response = await api.post(`/driver/${orderId}/decline`, { reason });

  return response.data;
}

export async function pickupJobsService({ orderId }: { orderId: string }) {
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const response = await api.post(`/driver/${orderId}/pickup`);

  return response.data;
}

export async function deliveryJobsService({
  orderId,
  code,
}: {
  orderId: string;
  code: string;
}) {
  if (!orderId) {
    throw new Error('Order ID is required');
  }
  if (!code) {
    throw new Error('Delivery code is required');
  }

  try {
    const payload = { orderCode: code };

    const response = await api.post(`/driver/${orderId}/deliver`, payload);

    return response.data;
  } catch (error: any) {
    throw error;
  }
}



export async function getChatService(orderId: string) {
  const response = await api.get(`/chat/orders/${orderId}/messages`);

  return response.data;
}