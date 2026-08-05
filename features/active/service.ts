import { api } from '@/libs/api';

export async function getActiveOrderService() {
  const response = await api.get('/driver/active-order');

  return response.data;
}

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
  console.log('Declining job with ID:', { orderId, reason });
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const response = await api.post(`/driver/${orderId}/decline`, { reason });

  return response.data;
}

export async function pickupJobsService({ orderId }: { orderId: string }) {
  console.log('Picking up job with ID:', { orderId });
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
  console.log('🚗 Delivering job with ID:', { orderId, code });
  if (!orderId) {
    throw new Error('Order ID is required');
  }
  if (!code) {
    throw new Error('Delivery code is required');
  }

  try {
    const payload = { orderCode: code };
    console.log('📤 Request payload:', payload);
    console.log('📍 Request URL: /driver/${orderId}/deliver');

    const response = await api.post(`/driver/${orderId}/deliver`, payload);

    console.log('✅ Delivery response:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('❌ Delivery error:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    console.log(' 🚨 Error details Status:', error);
    throw error;
  }
}



export async function getChatService(orderId: string) {
  const response = await api.get(`/chat/orders/${orderId}/messages`);

  return response.data;
}