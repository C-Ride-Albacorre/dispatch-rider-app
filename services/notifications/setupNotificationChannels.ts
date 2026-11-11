import { setNotificationChannelAsync } from 'expo-notifications';
import { Platform } from 'react-native';

export async function setupNotificationChannels() {
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    // Delivery/Order Request Channel
    await setNotificationChannelAsync('delivery_requests', {
      name: 'Delivery Requests',
      importance: 4,
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
      importance: 2,
      vibrationPattern: [0, 100],
      enableVibrate: true,
      enableLights: false,
      bypassDnd: false,
    });
  } catch {}
}

