import {
  HEADER_HEIGHT,
  useHeaderReset,
  useScrollHeader,
} from '@/components/layout/scroll-header-context';
import { useEarningsDashboard } from '@/features/earnings/use-fetch';
import { useDashboardStats } from '@/features/home/use-fetch';
import ProfileFrame from '@/features/profile/components/profile-frame';
import ProfileMenu from '@/features/profile/components/profile-menu';
import DriverStats from '@/features/profile/components/stats';
import { useTheme } from '@/hooks/use-theme';
import { scale } from '@/utils/scaling';

import ConfirmLogout from '@/features/profile/components/confirm-logout';
import DeleteAccountModal from '@/features/profile/components/delete-account/delete-account-modal';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const resetHeader = useHeaderReset();

  useFocusEffect(
    useCallback(() => {
      resetHeader();
    }, []),
  );

  const scrollHandler = useScrollHeader();

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const { data, isLoading } = useDashboardStats();

  const { data: earningsData } = useEarningsDashboard('TODAY');

  const stats = data?.stats;

  const driverInfo = data?.personalInfo;

  return (
    <>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + insets.top }}
      >
        <View style={styles.container}>
          <ProfileFrame
            stats={stats}
            driverInfo={driverInfo}
            isLoading={isLoading}
          />

          <DriverStats earnings={earningsData?.summary} />

          <ProfileMenu
            stats={stats}
            onSignOut={() => setShowLogoutModal(true)}
            onDeleteAccount={() => setShowDeleteModal(true)}
          />
        </View>
      </Animated.ScrollView>

      <ConfirmLogout
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
      />

      <DeleteAccountModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      />
    </>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(12),
      paddingVertical: scale(24),
      backgroundColor: Colors.background,
      gap: scale(24),
    },
  });
