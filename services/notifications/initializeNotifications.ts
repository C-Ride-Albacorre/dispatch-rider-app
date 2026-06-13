import messaging from '@react-native-firebase/messaging';

import { requestNotificationPermission } from './requestNotificationPermission';
import { registerDeviceToken } from './registerDeviceToken';
import { getFCMToken } from './getFcmToken';

let unsubscribeTokenRefresh: (() => void) | null = null;

export function cleanupNotifications() {
  if (unsubscribeTokenRefresh) {
    unsubscribeTokenRefresh();
    unsubscribeTokenRefresh = null;
  }
}

export async function initializeNotifications() {
  console.log('Initializing notifications...');

  try {
    // Avoid creating multiple listeners
    if (unsubscribeTokenRefresh) {
      return;
    }

    // 1. Request notification permission
    const permissionGranted = await requestNotificationPermission();

    if (!permissionGranted) {
      console.log('Notification permission not granted');
      return;
    }

    console.log('Permission granted');

    // 2. Get current FCM token
    const token = await getFCMToken();

    if (token) {
      // 3. Register token with backend
      await registerDeviceToken(token);

      console.log('FCM token registered successfully');
    }

    // 4. Listen for future token changes
    unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      try {
        await registerDeviceToken(newToken);

        console.log('FCM token refreshed and updated');
      } catch (error) {
        console.error('Failed to update refreshed FCM token:', error);
      }
    });
  } catch (error) {
    console.error('Notification initialization failed:', error);
  }

  console.log('FCM token sent to backend');
}
