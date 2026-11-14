import { api } from '@/libs/api';
import messaging from '@react-native-firebase/messaging';

import { pushError } from './pushLog';

/**
 * Tells the backend to stop sending pushes to this device. The endpoint needs
 * the token itself (same contract as the merchant app), then the local token
 * is deleted so the next sign-in registers a fresh one.
 */
export async function unregisterDeviceToken() {
  const token = await messaging().getToken();

  const response = await api.post('/notification/device/unregister-token', {
    token,
  });

  await messaging()
    .deleteToken()
    .catch((error) => pushError('deleteToken', error));

  return response.data;
}
