import messaging from '@react-native-firebase/messaging';

export async function getFCMToken() {
  try {

    const token = await messaging().getToken();


    if (!token) {
      return null;
    }

    return token;
  } catch {
    return null;
  }
}
