import ScreenHeader from '@/components/layout/screen-header';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useEarningsDashboard } from '@/features/earnings/use-fetch';
import { useDashboardStats } from '@/features/home/use-fetch';
import ProfileFrame from '@/features/profile/components/profile-frame';
import ProfileMenu from '@/features/profile/components/profile-menu';
import DriverStats from '@/features/profile/components/stats';

import DeleteAccountModal from '@/features/profile/components/delete-account/delete-account-modal';
import { useAuthStore } from '@/store/auth-store';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

const confirmSignOut = () =>
  Alert.alert(
    'Sign out?',
    'You will need to log in again to access your account.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => useAuthStore.getState().logout(),
      },
    ],
  );

export default function ProfileScreen() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading } = useDashboardStats();

  const { data: earningsData } = useEarningsDashboard('TODAY');

  const stats = data?.stats;

  const driverInfo = data?.personalInfo;

  return (
    <ThemedView style={styles.flex}>
      <StatusBar style="auto" />
      <ScreenHeader title="Profile" subtitle="Your account and performance" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ProfileFrame
          stats={stats}
          driverInfo={driverInfo}
          isLoading={isLoading}
        />

        <DriverStats earnings={earningsData?.summary} />

        <ProfileMenu
          stats={stats}
          performance={earningsData?.performance}
          onSignOut={confirmSignOut}
          onDeleteAccount={() => setShowDeleteModal(true)}
        />
      </ScrollView>

      <DeleteAccountModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  content: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
  },
});
