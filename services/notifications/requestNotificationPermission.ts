import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { pushError, pushLog } from './pushLog';

export async function requestNotificationPermission() {
  try {
    if (Platform.OS === 'android') {
      const result = await Notifications.requestPermissionsAsync();

      pushLog('android permission response', result);

      return result.granted;
    }

    const authorizationStatus = await messaging().requestPermission();

    pushLog('iOS authorization status', authorizationStatus);

    const enabled =
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  } catch (error) {
    pushError('requestNotificationPermission', error);
    return false;
  }
}
