import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';

import { handleNotificationNavigation } from '@/utils/notification-navigation';
import { useNotificationStore } from '@/store/notification-store';

export function useNotificationListeners() {
  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        console.log('Foreground:', remoteMessage);

        const store = useNotificationStore.getState();

        store.addNotification(remoteMessage);

        store.showBanner(remoteMessage);
      },
    );

    const unsubscribeOpened = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log('Opened from background:', remoteMessage);

        handleNotificationNavigation(remoteMessage);
      },
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (!remoteMessage) return;

        console.log('Opened from quit state:', remoteMessage);

        handleNotificationNavigation(remoteMessage);
      });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, []);
}
