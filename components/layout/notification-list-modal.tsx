import { Ionicons } from '@expo/vector-icons';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  useNotificationStore,
  type NotificationItem,
} from '@/store/notification-store';
import { handleNotificationNavigation } from '@/utils/notification-navigation';
import { normalize, scale } from '@/utils/scaling';
import IconButton from '../ui/buttons/icon-button';
import { is } from 'zod/v4/locales';

type NotificationListModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function NotificationListModal({
  visible,
  onClose,
}: NotificationListModalProps) {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();

  const notifications = useNotificationStore((s) => s.notifications);
  const markAsViewed = useNotificationStore((s) => s.markAsViewed);

  const styles = createStyles(Colors);

  const handleNotificationPress = (notification: NotificationItem) => {
    // Mark as viewed
    markAsViewed(notification.messageId);

    // Navigate based on notification type
    handleNotificationNavigation(notification as any);

    // Close modal after navigation
    onClose();
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    const isViewed = !!item.viewedAt;

    return (
      <Pressable
        style={[
          styles.notificationItem,
          !isViewed && { backgroundColor: Colors.primaryLight + '20' }, isViewed && { backgroundColor: Colors.backgroundTertiary + '70' },
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.unreadIndicator, isViewed && { opacity: 0 }]}>
          <View
            style={[styles.unreadDot, { backgroundColor: Colors.error }]}
          />
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.notificationTitle, { textTransform: 'capitalize',},
                !isViewed && { fontFamily: Fonts.brandSemiBold, maxWidth: scale(240) },
                isViewed && { fontFamily: Fonts.brandMedium, maxWidth: scale(240) },
              ]}
              numberOfLines={1}
            >
              {item.notification?.title?.toLocaleLowerCase() || 'Notification'}
            </Text>

            <Text style={styles.timestamp}>
              {getTimeAgo(
                item.sentTime ? parseInt(String(item.sentTime)) : Date.now(),
              )}
            </Text>
          </View>

          <Text style={styles.notificationBody} numberOfLines={2}>
            {item.notification?.body || 'No message'}
          </Text>

          {item.data?.type && (
            <View style={styles.typeTag}>
              <Text style={styles.typeTagText}>
                {getNotificationType(String(item.data.type))}
              </Text>
            </View>
          )}
        </View>

        <Ionicons
          name="chevron-forward"
          size={scale(20)}
          color={Colors.textSecondary}
          style={styles.chevron}
        />
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: Colors.backgroundSecondary },
        ]}
      >
        <Ionicons
          name="notifications-outline"
          size={scale(48)}
          color={Colors.textMuted}
        />
      </View>

      <Text style={styles.emptyText}>No notifications yet</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      {/* Overlay Background */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Modal Content */}
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>

          <IconButton icon="close" size="md" variant="soft" onPress={onClose} style={styles.closeButton} accessibilityLabel="Close" />
        </View>

        {/* Notifications List */}
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.messageId || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          scrollEnabled={notifications.length > 0}
        />
      </View>
    </Modal>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}

function getNotificationType(type: string): string {
  switch (type) {
    case 'chat':
      return 'Message';
    case 'job':
    case 'delivery_request':
      return 'Job';
    default:
      return 'Notification';
  }
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      zIndex: 1000,
    },

    iconWrapper: {
      width: scale(72),
      height: scale(72),
      borderRadius: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: scale(16),
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: scale(16),
      paddingVertical: scale(16),
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },

    headerTitle: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },

    closeButton: {
      padding: scale(8),
    },

    listContent: {
      paddingHorizontal: scale(12),
      paddingVertical: scale(12),
      flexGrow: 1,
    },

    notificationItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: scale(12),
      padding: scale(12),
      marginBottom: scale(8),
      backgroundColor: Colors.card,
      borderRadius: scale(16),
      borderWidth: 1,
      borderColor: Colors.border,
    },

    unreadIndicator: {
      width: scale(12),
      height: scale(12),
      marginTop: scale(4),
      justifyContent: 'center',
      alignItems: 'center',
    },

    unreadDot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
    },

    notificationContent: {
      flex: 1,
      gap: scale(6),
    },

    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: scale(8),
    },

    notificationTitle: {
      flex: 1,
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
    },

    timestamp: {
      fontSize: normalize(10),
      fontFamily: Fonts.brandRegular,
      color: Colors.textMuted,
    },

    notificationBody: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandRegular,
      color: Colors.textSecondary,
      lineHeight: scale(18),
    },

    typeTag: {
      alignSelf: 'flex-start',
      paddingHorizontal: scale(8),
      paddingVertical: scale(4),
      backgroundColor: Colors.primary + '15',
      borderRadius: scale(6),
    },

    typeTagText: {
      fontSize: normalize(10),
      fontFamily: Fonts.brandMedium,
      color: Colors.primary,
    },

    chevron: {
      marginTop: scale(4),
    },

    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: scale(12),
    },

    emptyText: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
    },

    overlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });
