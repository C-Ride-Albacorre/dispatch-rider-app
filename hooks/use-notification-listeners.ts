import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

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

    // Taps on notifications shown by the OS from an FCM `notification` payload
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

    // Taps on notifications displayed locally by the background handler
    // (data-only FCM messages), which FCM's listeners above don't see
    const localResponseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Opened local notification:', response);

        handleNotificationNavigation(response.notification.request.content);
      });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;

      console.log('Opened local notification from quit state:', response);

      handleNotificationNavigation(response.notification.request.content);
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
      localResponseSubscription.remove();
    };
  }, []);
}
