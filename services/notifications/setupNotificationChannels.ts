import { setNotificationChannelAsync } from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Set up Android notification channels.
 * Must be called early in app startup (before notifications can arrive).
 * iOS doesn't use channels - it uses APN configurations instead.
 *
 * `sound` is left out on purpose so channels use the phone's default
 * notification sound. A sound name that isn't bundled in the app (e.g.
 * 'notification') creates a SILENT channel. To use a custom sound, add the file
 * to the expo-notifications plugin `sounds` in app.json and use a new channel
 * id, because Android never changes the sound of an existing channel.
 */
export async function setupNotificationChannels() {
  // Notification channels are only needed on Android
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    console.log('🔔 [Channels] Setting up Android notification channels...');

    // Delivery/Order Request Channel
    await setNotificationChannelAsync('delivery_requests', {
      name: 'Delivery Requests',
      importance: 4, // IMPORTANCE_HIGH
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B35',
      enableVibrate: true,
      enableLights: true,
      bypassDnd: true,
    });

    // Chat/Message Channel
    await setNotificationChannelAsync('messages', {
      name: 'Messages',
      importance: 4,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B35',
      enableVibrate: true,
      enableLights: false,
      bypassDnd: false,
    });

    // General Updates Channel
    await setNotificationChannelAsync('general', {
      name: 'General Updates',
      importance: 2, // IMPORTANCE_LOW
      vibrationPattern: [0, 100],
      enableVibrate: true,
      enableLights: false,
      bypassDnd: false,
    });

    console.log('✅ [Channels] Notification channels created successfully');
  } catch (error) {
    console.error(
      '❌ [Channels] Failed to setup notification channels:',
      error,
    );
  }
}

