import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import {
  DELIVERY_REQUESTS_CHANNEL_ID,
  setupNotificationChannels,
} from './setupNotificationChannels';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log(
    '[notification:background]',
    JSON.stringify(remoteMessage, null, 2),
  );

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
        Platform.OS === 'android' ? { channelId: DELIVERY_REQUESTS_CHANNEL_ID } : null,
    });
  } catch {}
});
