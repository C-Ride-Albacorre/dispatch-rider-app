import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermission() {
  try {
    console.log('🔔 [FCM] Requesting notification permission...');

    // messaging().requestPermission() always resolves AUTHORIZED on Android
    // without showing a prompt, so Android 13+ (POST_NOTIFICATIONS) would
    // never be granted. expo-notifications shows the real system prompt.
    if (Platform.OS === 'android') {
      const { granted } = await Notifications.requestPermissionsAsync();

      console.log('🔔 [FCM] Android permission granted:', granted);

      return granted;
    }

    const authorizationStatus = await messaging().requestPermission();

    console.log('Notification permission status:', authorizationStatus);

    const enabled =
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log('🔔 [FCM] Permission enabled:', enabled);

    return enabled;
  } catch (error) {
    console.error('Error requesting notification permission:', error);

    return false;
  }
}
