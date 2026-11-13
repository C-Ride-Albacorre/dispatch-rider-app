import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { create } from 'zustand';

type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;

export type NotificationItem = RemoteMessage & {
  viewedAt?: number;
  /** Read from the system tray: Android's id, not the FCM messageId. */
  fromTray?: boolean;
};

type NotificationStore = {
  notifications: NotificationItem[];
  /** Always equal to the number of notifications without `viewedAt`. */
  unreadCount: number;

  banner: RemoteMessage | null;

  addNotification: (
    notification: RemoteMessage,
    options?: { viewed?: boolean },
  ) => void;

  /**
   * Pulls in notifications sitting in the system tray, i.e. ones that
   * arrived while the app was in the background or closed and were never
   * seen by the foreground listener.
   */
  syncPresentedNotifications: () => Promise<void>;

  showBanner: (notification: RemoteMessage) => void;

  clearBanner: () => void;

  markAsViewed: (messageId: string | undefined) => void;

  markAllAsRead: () => void;

  clearNotifications: () => void;
};

const countUnread = (list: NotificationItem[]) =>
  list.filter((n) => !n.viewedAt).length;

const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

/**
 * A tray notification and the FCM message it came from have different ids,
 * so match them on content and time instead.
 */
function isSameNotification(a: NotificationItem, b: NotificationItem) {
  if (a.messageId && a.messageId === b.messageId) return true;

  return (
    (a.notification?.title ?? '') === (b.notification?.title ?? '') &&
    (a.notification?.body ?? '') === (b.notification?.body ?? '') &&
    Math.abs(Number(a.sentTime ?? 0) - Number(b.sentTime ?? 0)) <=
      DUPLICATE_WINDOW_MS
  );
}

/** Converts a tray notification into the RemoteMessage shape the list renders. */
function fromPresented(n: Notifications.Notification): NotificationItem {
  const { content, identifier } = n.request;

  return {
    messageId: identifier,
    fromTray: true,
    sentTime: n.date,
    notification: {
      title: content.title ?? undefined,
      body: content.body ?? undefined,
    },
    data: (content.data ?? {}) as RemoteMessage['data'],
  } as NotificationItem;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  unreadCount: 0,

  banner: null,

  addNotification: (notification, options) => {
    const current = get().notifications;

    if (current.some((n) => n.messageId === notification.messageId)) return;

    // Same push already picked up from the tray: replace that copy with the
    // FCM message (it has the real messageId and the order data).
    const trayCopy = current.find(
      (n) => n.fromTray && isSameNotification(n, notification),
    );

    const viewedAt = options?.viewed
      ? Date.now()
      : (trayCopy?.viewedAt ?? undefined);

    const item: NotificationItem = viewedAt
      ? { ...notification, viewedAt }
      : notification;

    set((state) => {
      const notifications = trayCopy
        ? state.notifications.map((n) => (n === trayCopy ? item : n))
        : [item, ...state.notifications];
      return { notifications, unreadCount: countUnread(notifications) };
    });
  },

  syncPresentedNotifications: async () => {
    try {
      const presented = await Notifications.getPresentedNotificationsAsync();
      if (!presented.length) return;

      set((state) => {
        const incoming = presented
          .map(fromPresented)
          .filter(
            (tray) =>
              !state.notifications.some((n) => isSameNotification(n, tray)),
          );

        if (!incoming.length) return state;

        const notifications = [...incoming, ...state.notifications].sort(
          (a, b) => Number(b.sentTime ?? 0) - Number(a.sentTime ?? 0),
        );

        return { notifications, unreadCount: countUnread(notifications) };
      });
    } catch (error) {
      console.warn('[notification] failed to read tray notifications', error);
    }
  },

  showBanner: (notification) =>
    set({
      banner: notification,
    }),

  clearBanner: () =>
    set({
      banner: null,
    }),

  markAsViewed: (messageId) => {
    if (!messageId) return;

    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.messageId === messageId && !n.viewedAt
          ? { ...n, viewedAt: Date.now() }
          : n,
      );
      return { notifications, unreadCount: countUnread(notifications) };
    });
  },

  markAllAsRead: () => {
    const now = Date.now();

    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.viewedAt ? n : { ...n, viewedAt: now },
      ),
      unreadCount: 0,
    }));

    // They've been seen in the app, so clear them from the system tray too.
    Notifications.dismissAllNotificationsAsync().catch(() => {});
  },

  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
      banner: null,
    });

    Notifications.dismissAllNotificationsAsync().catch(() => {});
  },
}));
