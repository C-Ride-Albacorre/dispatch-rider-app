import NotificationListModal from '@/components/layout/notification-list-modal';
import { ThemedText } from '@/components/themed-text';
import Avatar from '@/components/ui/avatar';
import IconButton from '@/components/ui/buttons/icon-button';
import { Fonts } from '@/constants/theme';
import { useDashboardStats } from '@/features/home/use-fetch';
import { useNotificationStore } from '@/store/notification-store';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

/** Top row of the Home hero: brand, notifications and the driver's avatar */
export default function AppHeader() {
  const { data } = useDashboardStats();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  const driverInfo = data?.personalInfo;
  const driverName =
    `${driverInfo?.firstName ?? ''} ${driverInfo?.lastName ?? ''}`.trim();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={require('@/assets/images/c-ride-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <ThemedText style={styles.brand} themeColor="white">
            C-Ride
          </ThemedText>
          <ThemedText style={styles.brandSub} themeColor="primary">
            Rider
          </ThemedText>
        </View>
      </View>

      <View style={styles.headerRight}>
        <IconButton
          icon="notifications-outline"
          variant="glass"
          size="md"
          notificationCount={unreadCount}
          onPress={() => setIsModalOpen(true)}
          accessibilityLabel="Notifications"
        />

        <Pressable
          onPress={() => router.push('/profile')}
          accessibilityRole="button"
          accessibilityLabel="Profile"
        >
          <Avatar
            src={driverInfo?.profileImage ?? undefined}
            name={driverName}
            size={40}
          />
        </Pressable>
      </View>

      <NotificationListModal
        visible={isModalOpen}
        onClose={() => {
          markAllAsRead();
          setIsModalOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },

  brand: {
    fontFamily: Fonts.brandBold,
    fontSize: 18,
    lineHeight: 22,
  },

  brandSub: {
    fontFamily: Fonts.brandMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
