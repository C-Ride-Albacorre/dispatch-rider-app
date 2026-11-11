import { Ionicons } from '@expo/vector-icons';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  useNotificationStore,
  type NotificationItem,
} from '@/store/notification-store';
import { handleNotificationNavigation } from '@/utils/notification-navigation';
import IconButton from '../ui/buttons/icon-button';

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
    markAsViewed(notification.messageId);

    handleNotificationNavigation(notification as any);

    onClose();
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    const isViewed = !!item.viewedAt;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          !isViewed && styles.cardUnread,
          pressed && styles.pressed,
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.unreadIndicator, isViewed && { opacity: 0 }]}>
          <View style={styles.unreadDot} />
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.titleRow}>
            <ThemedText
              style={[
                styles.notificationTitle,
                isViewed && { fontFamily: Fonts.brandMedium },
              ]}
              numberOfLines={1}
            >
              {item.notification?.title?.toLocaleLowerCase() || 'Notification'}
            </ThemedText>

            <ThemedText style={styles.meta} themeColor="textMuted">
              {getTimeAgo(
                item.sentTime ? parseInt(String(item.sentTime)) : Date.now(),
              )}
            </ThemedText>
          </View>

          <ThemedText
            style={styles.notificationBody}
            themeColor="textSecondary"
            numberOfLines={2}
          >
            {item.notification?.body || 'No message'}
          </ThemedText>

          {item.data?.type && (
            <View style={styles.typeTag}>
              <ThemedText style={styles.typeTagText} themeColor="primary">
                {getNotificationType(String(item.data.type))}
              </ThemedText>
            </View>
          )}
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={Colors.textMuted}
          style={styles.chevron}
        />
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.iconWrapper}>
        <Ionicons
          name="notifications-outline"
          size={20}
          color={Colors.textMuted}
        />
      </View>

      <ThemedText style={styles.emptyTitle}>No notifications yet</ThemedText>
      <ThemedText style={styles.emptyMessage} themeColor="textMuted">
        Job offers and updates will show up here.
      </ThemedText>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
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
          <View style={styles.flex}>
            <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
            <ThemedText style={styles.headerSubtitle} themeColor="textMuted">
              Tap one to open it
            </ThemedText>
          </View>

          <IconButton
            icon="close"
            iconSize={18}
            variant="soft"
            onPress={onClose}
            accessibilityLabel="Close"
          />
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
    flex: {
      flex: 1,
    },

    container: {
      flex: 1,
      backgroundColor: Colors.background,
      zIndex: 1000,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.three,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },

    headerTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
    },

    headerSubtitle: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 18,
    },

    listContent: {
      flexGrow: 1,
      gap: Spacing.two,
      padding: Spacing.three,
    },

    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    cardUnread: {
      backgroundColor: Colors.primaryExtraLight,
      borderColor: Colors.primaryLight,
    },

    pressed: {
      backgroundColor: Colors.backgroundSecondary,
    },

    unreadIndicator: {
      width: 8,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },

    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.primary,
    },

    notificationContent: {
      flex: 1,
      gap: 2,
    },

    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.two,
    },

    notificationTitle: {
      flex: 1,
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
      textTransform: 'capitalize',
    },

    meta: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    notificationBody: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    typeTag: {
      alignSelf: 'flex-start',
      marginTop: Spacing.one,
      paddingHorizontal: Spacing.two,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: Colors.primaryLight,
    },

    typeTagText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
    },

    chevron: {
      marginTop: 1,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.two,
      paddingHorizontal: Spacing.four,
    },

    iconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.one,
      backgroundColor: Colors.backgroundTertiary,
    },

    emptyTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    emptyMessage: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
    },

    overlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: Colors.overlay,
    },
  });
