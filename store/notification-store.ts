import { create } from 'zustand';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

type RemoteMessage = FirebaseMessagingTypes.RemoteMessage;

type NotificationStore = {
  notifications: RemoteMessage[];
  unreadCount: number;

  banner: RemoteMessage | null;

  addNotification: (notification: RemoteMessage) => void;

  showBanner: (notification: RemoteMessage) => void;

  clearBanner: () => void;

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