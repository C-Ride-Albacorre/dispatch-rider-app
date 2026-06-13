import messaging from '@react-native-firebase/messaging';

export async function requestNotificationPermission() {
  try {
    const authorizationStatus = await messaging().requestPermission();

    console.log('Notification permission status:', authorizationStatus);

    const enabled =
      authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  } catch (error) {
    console.error('Error requesting notification permission:', error);

    return false;
  }
}
