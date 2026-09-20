import messaging from '@react-native-firebase/messaging';

export async function requestNotificationPermission() {
  try {
    console.log('🔔 [FCM] Requesting notification permission...');

    const authorizationStatus = await messaging().requestPermission();

    console.log('Notification permission status:', authorizationStatus);


     const statuses = messaging.AuthorizationStatus;

    console.log('🔔 [FCM] Authorization constants:', {
      AUTHORIZED: statuses.AUTHORIZED,
      PROVISIONAL: statuses.PROVISIONAL,
      DENIED: statuses.DENIED,
      NOT_DETERMINED: statuses.NOT_DETERMINED,
    });

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
