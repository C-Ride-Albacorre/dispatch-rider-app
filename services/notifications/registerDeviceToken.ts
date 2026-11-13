import { api } from '@/libs/api';
import { Platform } from 'react-native';

import { pushLog } from './pushLog';

export async function registerDeviceToken(token: string) {
  const body = {
    token,
    deviceType: Platform.OS,
  };

  pushLog('POST /notification/device/register-token request', body);

  const response = await api.post('/notification/device/register-token', body);

  pushLog('POST /notification/device/register-token response', {
    status: response.status,
    data: response.data,
  });

  return response.data;
}
