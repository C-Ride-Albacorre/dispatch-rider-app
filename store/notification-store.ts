import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { create } from 'zustand';

type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;

export type NotificationItem = RemoteMessage & {
  viewedAt?: number;
};

type NotificationStore = {
  notifications: NotificationItem[];
  unreadCount: number;

  banner: RemoteMessage | null;

  addNotification: (notification: RemoteMessage) => void;

  showBanner: (notification: RemoteMessage) => void;

  clearBanner: () => void;

  markAsViewed: (messageId: string | undefined) => void;

  markAllAsRead: () => void;

  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  unreadCount: 0,

  banner: null,

  addNotification: (notification) => {
    const exists = get().notifications.some(
      (n) => n.messageId === notification.messageId,
    );

    if (exists) return;

    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
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

    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.messageId === messageId ? { ...n, viewedAt: Date.now() } : n,
      ),
    }));
  },

  markAllAsRead: () =>
    set({
      unreadCount: 0,
    }),

  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
      banner: null,
    }),
}));
