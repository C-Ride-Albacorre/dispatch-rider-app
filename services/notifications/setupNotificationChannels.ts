import {
  AndroidImportance,
  AndroidNotificationVisibility,
  deleteNotificationChannelAsync,
  getNotificationChannelsAsync,
  setNotificationChannelAsync,
} from 'expo-notifications';
import { Platform } from 'react-native';

import { pushError, pushLog } from './pushLog';

/**
 * Channel used for delivery requests. The backend must send this exact id in
 * `android.notification.channelId`, and firebase.json uses it as the default.
 *
 * A channel's importance/sound cannot be changed after it is created on a
 * device, so to change those settings bump the id (e.g. `_v3`), update
 * firebase.json + the backend, and add the old id to LEGACY_CHANNEL_IDS.
 */
export const DELIVERY_REQUESTS_CHANNEL_ID = 'delivery_requests_v2';

const LEGACY_CHANNEL_IDS = ['delivery_requests'];

export async function setupNotificationChannels() {
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    // Delivery/Order Request Channel: heads-up pop-up with sound.
    // Leave `sound` unset to get the system default sound; any string is
    // treated as a custom file in res/raw.
    await setNotificationChannelAsync(DELIVERY_REQUESTS_CHANNEL_ID, {
      name: 'Delivery Requests',
      description: 'New delivery jobs you can accept',
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B35',
      enableVibrate: true,
      enableLights: true,
      lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });

    // Remove the old channel so it no longer shows up in system settings.
    await Promise.all(
      LEGACY_CHANNEL_IDS.map((id) =>
        deleteNotificationChannelAsync(id).catch(() => {}),
      ),
    );

    // Chat/Message Channel
    await setNotificationChannelAsync('messages', {
      name: 'Messages',
      importance: AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B35',
      enableVibrate: true,
      enableLights: false,
      bypassDnd: false,
    });

    // General Updates Channel
    await setNotificationChannelAsync('general', {
      name: 'General Updates',
      importance: AndroidImportance.LOW,
      vibrationPattern: [0, 100],
      enableVibrate: true,
      enableLights: false,
      bypassDnd: false,
    });

    // What the device actually has (importance can differ from the above if
    // the user changed it in settings).
    const channels = await getNotificationChannelsAsync();
    pushLog(
      'android channels on device',
      channels.map((c) => ({
        id: c.id,
        importance: c.importance,
        sound: c.sound,
      })),
    );
  } catch (error) {
    pushError('setupNotificationChannels', error);
  }
}
