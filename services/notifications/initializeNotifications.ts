import messaging from '@react-native-firebase/messaging';

import { getFCMToken } from './getFcmToken';
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
  try {
    if (unsubscribeTokenRefresh) {
      return;
    }

    // 0. Setup notification channels
    await setupNotificationChannels();

    // 1. Request notification permission
    const permissionGranted = await requestNotificationPermission();

    if (!permissionGranted) {
      return;
    }

    // iOS APNs token
    await messaging().getAPNSToken();

    // 2. Get current FCM token
    const token = await getFCMToken();

    if (token) {
      // 3. Register token with backend
      await registerDeviceToken(token);
    }

    // 4. Listen for future token changes
    unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      try {
        await registerDeviceToken(newToken);
      } catch {}
    });
  } catch {}
}
