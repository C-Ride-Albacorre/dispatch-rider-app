import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { pushError } from './pushLog';
import { DELIVERY_REQUESTS_CHANNEL_ID } from './setupNotificationChannels';

/** Marks local notifications that exist only to make a sound in the foreground. */
const SOUND_ONLY_KEY = '__soundOnly';

/**
 * Foreground presentation rules for expo-notifications.
 *
 * - Sound-only notifications: play the sound, show nothing. On Android
 *   expo-notifications plays the channel's sound and never posts the
 *   notification, so it doesn't land in the tray or the unread count.
 * - Everything else: not shown while the app is open (the app shows its own
 *   in-app banner instead). This matches the behaviour before a handler was set.
 */
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const soundOnly = !!notification.request.content.data?.[SOUND_ONLY_KEY];

    console.log('[notification:handler]', {
      id: notification.request.identifier,
      title: notification.request.content.title,
      soundOnly,
    });

    return {
      shouldShowBanner: false,
      shouldShowList: false,
      shouldPlaySound: soundOnly,
      shouldSetBadge: false,
    };
  },
});

/**
 * FCM never shows a system notification (or plays a sound) for messages
 * received while the app is open, so play the alert sound ourselves.
 */
export async function playForegroundNotificationSound(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) {
  void Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success,
  ).catch(() => {});

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: remoteMessage.notification?.title ?? '',
        body: remoteMessage.notification?.body ?? '',
        sound: true,
        data: { [SOUND_ONLY_KEY]: true },
      },
      trigger:
        Platform.OS === 'android'
          ? { channelId: DELIVERY_REQUESTS_CHANNEL_ID }
          : null,
    });
  } catch (error) {
    pushError('play foreground notification sound', error);
  }
}
