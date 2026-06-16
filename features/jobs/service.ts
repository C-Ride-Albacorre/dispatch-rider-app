import { api } from '@/libs/api';

export async function getAvailableJobsService(
  lat: number,
  lng: number,
) {

  console.log('Fetching available jobs for location:', { lat, lng });

  
  const response = await api.get('/driver/available', {
    params: {
      lat,
      lng,
    },
  });

  return response.data;
}