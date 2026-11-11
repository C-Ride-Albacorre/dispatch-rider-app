import { api } from "@/libs/api";
import { Platform } from "react-native";

export async function registerDeviceToken(token: string) {
  const response = await api.post('/notification/device/register-token', {
    token,
    deviceType: Platform.OS,
  });

  return response.data;
}
