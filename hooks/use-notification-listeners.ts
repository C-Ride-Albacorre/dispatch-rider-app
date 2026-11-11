import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

import { handleNotificationNavigation } from '@/utils/notification-navigation';
import { useNotificationStore } from '@/store/notification-store';

export function useNotificationListeners() {
  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        const store = useNotificationStore.getState();

        store.addNotification(remoteMessage);

        store.showBanner(remoteMessage);
      },
    );

    const unsubscribeOpened = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        handleNotificationNavigation(remoteMessage);
      },
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (!remoteMessage) return;

        handleNotificationNavigation(remoteMessage);
      });

    const localResponseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationNavigation(response.notification.request.content);
      });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;

      handleNotificationNavigation(response.notification.request.content);
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
      localResponseSubscription.remove();
    };
  }, []);
}
