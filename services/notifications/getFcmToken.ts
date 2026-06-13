import messaging from '@react-native-firebase/messaging';

export async function getFCMToken() {
  try {
    const token = await messaging().getToken();

    if (!token) {
      console.warn('FCM token was not generated');
      return null;
    }

    console.log('FCM Token:', token);

    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', error);

    return null;
  }
}
