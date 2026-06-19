import { api } from '@/libs/api';

export async function getAvailableJobsService(lat: number, lng: number) {

if (!lat || !lng) {
    throw new Error('Latitude and longitude are required to fetch available jobs.');
  }

  console.log('Fetching available jobs for location:', { lat, lng });

  const response = await api.get('/driver/available-orders', {
    params: {
      lat,
      lng,
    },
  });

  return response.data;
}

export async function getAvailableJobsDetailsService(orderId: string) {
  console.log('Fetching available job details for order ID:', { orderId });

  const response = await api.get(`/driver/available-order/${orderId}`);

  return response.data;
}

export async function acceptJobsService(orderId: string) {
  console.log('Accepting job with ID:', { orderId });
if (!orderId) {
    throw new Error('Order ID is required');
  }


  const response = await api.post(`/driver/${orderId}/accept`);

  return response.data;
}
