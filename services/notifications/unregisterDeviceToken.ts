import { api } from "@/libs/api";


export async function unregisterDeviceToken() {
  const response = await api.post(
    '/notification/device/unregister-token',
  );

  return response.data;
}