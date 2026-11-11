import { router } from 'expo-router';

type NotificationData = {
  type?: string;
  orderId?: string;
};

export function handleNotificationNavigation(notification: {
  data?: Record<string, unknown> | null;
}) {
  const data = notification.data as NotificationData | undefined;

  if (!data) {
    return;
  }

  const { type, orderId } = data;

  switch (type) {
    case 'delivery_request':
    case 'job':
      if (!orderId) {
        return;
      }

      router.push({
        pathname: '/jobs',
        params: {
          orderId,
        },
      });

      break;

    case 'chat':
      if (!orderId) {
        return;
      }

      router.push({
        pathname: '/(app)/(protected)/(tabs)/active/[orderId]',
        params: {
          orderId,
        },
      });

      break;

    default:
      break;
  }
}
