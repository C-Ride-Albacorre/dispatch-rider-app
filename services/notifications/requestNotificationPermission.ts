import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermission() {
  try {
    if (Platform.OS === 'android') {
      const { granted } = await Notifications.requestPermissionsAsync();

      return granted;
    }

    const authorizationStatus = await messaging().requestPermission();

    const enabled =
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  } catch {
    return false;
  }
}
