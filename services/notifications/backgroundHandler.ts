import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { setupNotificationChannels } from './setupNotificationChannels';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (remoteMessage.notification) {
    return;
  }

  const data = remoteMessage.data ?? {};

  const title = typeof data.title === 'string' ? data.title : 'New Update';
  const body = typeof data.body === 'string' ? data.body : '';

  try {
    await setupNotificationChannels();

    await Notifications.scheduleNotificationAsync({
      content: { title, body, data, sound: true },
      trigger:
        Platform.OS === 'android' ? { channelId: 'delivery_requests' } : null,
    });
  } catch {}
});
