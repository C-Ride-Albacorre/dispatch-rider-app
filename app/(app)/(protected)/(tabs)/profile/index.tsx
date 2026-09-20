import {
  HEADER_HEIGHT,
  useHeaderReset,
  useScrollHeader,
} from '@/components/layout/scroll-header-context';
import Button from '@/components/ui/buttons/button';
import { useEarningsDashboard } from '@/features/earnings/use-fetch';
import { useDashboardStats } from '@/features/home/use-fetch';
import DriverPerformance from '@/features/profile/components/performamce';
import ProfileFrame from '@/features/profile/components/profile-frame';
import Reviews from '@/features/profile/components/reviews';
import DriverStats from '@/features/profile/components/stats';
import { useTheme } from '@/hooks/use-theme';
import { scale } from '@/utils/scaling';

import ConfirmLogout from '@/features/profile/components/confirm-logout';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
          <DriverPerformance stats={stats} />

          <Reviews />

          <Button
            leftIcon={
              <Ionicons name="log-out-outline" size={scale(20)} color="white" />
            }
            variant="red"
            onPress={() => setShowLogoutModal(true)}
          >
            Sign out
          </Button>
        </View>
      </Animated.ScrollView>

      <ConfirmLogout
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
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
      gap: scale(16),
    },
  });
