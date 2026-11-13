import messaging from '@react-native-firebase/messaging';

import { pushError, pushLog } from './pushLog';

export async function getFCMToken() {
  try {
    pushLog('device registered for remote messages', {
      isDeviceRegisteredForRemoteMessages:
        messaging().isDeviceRegisteredForRemoteMessages,
    });

    const token = await messaging().getToken();

    if (!token) {
      pushLog('getToken returned empty token');
      return null;
    }

    pushLog('FCM token', token);

    return token;
  } catch (error) {
    pushError('getToken', error);
    return null;
  }
}
