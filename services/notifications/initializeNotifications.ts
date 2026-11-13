import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

import { getFCMToken } from './getFcmToken';
import { pushError, pushLog } from './pushLog';
import { registerDeviceToken } from './registerDeviceToken';
import { requestNotificationPermission } from './requestNotificationPermission';
import { setupNotificationChannels } from './setupNotificationChannels';

let unsubscribeTokenRefresh: (() => void) | null = null;

export function cleanupNotifications() {
  if (unsubscribeTokenRefresh) {
    unsubscribeTokenRefresh();
    unsubscribeTokenRefresh = null;
  }
}

export async function initializeNotifications() {
  pushLog('initializeNotifications called', { platform: Platform.OS });

  try {
    if (unsubscribeTokenRefresh) {
      pushLog('already initialized, skipping');
      return;
    }

    // 0. Setup notification channels
    await setupNotificationChannels();
    pushLog('notification channels set up');

    // 1. Request notification permission
    const permissionGranted = await requestNotificationPermission();
    pushLog('permission result', { permissionGranted });

    if (!permissionGranted) {
      pushLog('permission not granted, stopping (no token will be registered)');
      return;
    }

    // iOS APNs token
    const apnsToken = await messaging().getAPNSToken();
    pushLog('APNs token', apnsToken ?? '(none - expected on Android)');

    // 2. Get current FCM token
    const token = await getFCMToken();

    if (token) {
      // 3. Register token with backend
      try {
        await registerDeviceToken(token);
      } catch (error) {
        pushError('register token with backend', error);
      }
    } else {
      pushLog('no FCM token, skipping backend registration');
    }

    // 4. Listen for future token changes
    unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      pushLog('FCM token refreshed', newToken);
      try {
        await registerDeviceToken(newToken);
      } catch (error) {
        pushError('register refreshed token with backend', error);
      }
    });
    pushLog('token refresh listener attached');
  } catch (error) {
    pushError('initializeNotifications', error);
  }
}
