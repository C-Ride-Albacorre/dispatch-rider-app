import { useEffect } from 'react';
import { AppState } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

import { playForegroundNotificationSound } from '@/services/notifications/foregroundSound';
import { handleNotificationNavigation } from '@/utils/notification-navigation';
import { useNotificationStore } from '@/store/notification-store';

function logNotification(source: string, payload: unknown) {
  console.log(`[notification:${source}]`, JSON.stringify(payload, null, 2));
}

export function useNotificationListeners() {
  // Pick up notifications that arrived while the app was backgrounded/closed.
  useEffect(() => {
    const { syncPresentedNotifications } = useNotificationStore.getState();

    void syncPresentedNotifications();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void syncPresentedNotifications();
    });

    return () => sub.remove();
  }, []);

  // Keep the app icon badge in step with the unread count. iOS and launchers
  // that support numeric badges show the number; others show a dot.
  useEffect(() => {
    const apply = (count: number) =>
      Notifications.setBadgeCountAsync(count).catch(() => {});

    apply(useNotificationStore.getState().unreadCount);

    return useNotificationStore.subscribe((state, prev) => {
      if (state.unreadCount !== prev.unreadCount) apply(state.unreadCount);
    });
  }, []);

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        logNotification('foreground', remoteMessage);

        const store = useNotificationStore.getState();

        store.addNotification(remoteMessage);

        store.showBanner(remoteMessage);

        void playForegroundNotificationSound(remoteMessage);
      },
    );

    // Tapping a notification counts as reading it.
    const unsubscribeOpened = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        logNotification('opened-app', remoteMessage);

        useNotificationStore
          .getState()
          .addNotification(remoteMessage, { viewed: true });

        handleNotificationNavigation(remoteMessage);
      },
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (!remoteMessage) return;

        logNotification('initial', remoteMessage);

        useNotificationStore
          .getState()
          .addNotification(remoteMessage, { viewed: true });

        handleNotificationNavigation(remoteMessage);
      });

    const localResponseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        logNotification('local-response', response);

        // If the tray sync already added it, mark that entry read.
        useNotificationStore
          .getState()
          .markAsViewed(response.notification.request.identifier);

        handleNotificationNavigation(response.notification.request.content);
      });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;

      logNotification('last-local-response', response);

      useNotificationStore
        .getState()
        .markAsViewed(response.notification.request.identifier);

      handleNotificationNavigation(response.notification.request.content);
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
      localResponseSubscription.remove();
    };
  }, []);
}
