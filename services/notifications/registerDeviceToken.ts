import { api } from "@/libs/api";
import { Platform } from "react-native";

export async function registerDeviceToken(token: string) {
  console.log('Registering FCM token:', {
    token,
    deviceType: Platform.OS,
  });

  const response = await api.post('/notification/device/register-token', {
    token,
    deviceType: Platform.OS,
  });

  console.log('Register token response:', response.data);

  return response.data;
}
