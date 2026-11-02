import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { setupNotificationChannels } from './setupNotificationChannels';

/**
 * Handles FCM messages while the app is in the background or closed.
 *
 * Registered as a side effect of importing this module, which index.ts does
 * before loading the router. It must not live in a component or route layout:
 * when the app is closed, Android starts a headless JS task that never renders
 * the React tree, so a handler registered in _layout never runs.
 *
 * Messages with a `notification` payload are displayed by the OS itself, so
 * showing them here would duplicate them. Only data-only messages need to be
 * displayed locally.
 */
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('🔔 [Background] Message received:', {
    hasNotification: !!remoteMessage.notification,
    data: remoteMessage.data,
  });

  if (remoteMessage.notification) {
    return;
  }

  const data = remoteMessage.data ?? {};

  const title = typeof data.title === 'string' ? data.title : 'New Update';
  const body = typeof data.body === 'string' ? data.body : '';

  try {
    // The headless task can run before the app has ever been opened this
    // session, so make sure the channel exists
    await setupNotificationChannels();

    await Notifications.scheduleNotificationAsync({
      content: { title, body, data, sound: true },
      trigger:
        Platform.OS === 'android' ? { channelId: 'delivery_requests' } : null,
    });
  } catch (error) {
    console.error('❌ [Background] Failed to display notification:', error);
  }
});
