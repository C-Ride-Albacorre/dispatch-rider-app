import LocationPermissionModal from '@/components/layout/location-permission-modal';
import {
  HEADER_HEIGHT,
  useHeaderReset,
  useScrollHeader,
} from '@/components/layout/scroll-header-context';
import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import { useDashboardStats } from '@/features/home/use-fetch';
import LoadingJobs from '@/features/jobs/components/loading-jobs';
import NoJobs from '@/features/jobs/components/no-job';
import RenderJobCard from '@/features/jobs/components/render-job-card';
import RenderJobHeader from '@/features/jobs/components/render-job-header';
import { useLocation } from '@/hooks/use-location';
import { useTheme } from '@/hooks/use-theme';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { DriverStatus } from '../home';

// Stop the spinner if the server never answers with sync-orders
const REFRESH_TIMEOUT = 8000;

export type DriverOrder = {
  order_id: string;
  order_number?: string;
  order_status?: string;

  store_name?: string;
  store_logo?: string;

  total_amount: number;

  pickup_location?: {
    latitude: number;
    longitude: number;
    storeName?: string;
  };

  dropoff_location?: {
    address?: string;
  };

  created_at?: string;
};

export default function Jobs() {
  const insets = useSafeAreaInsets();
  const resetHeader = useHeaderReset();

  useFocusEffect(
    useCallback(() => {
      resetHeader();
    }, []),
  );

  const router = useRouter();

  const scrollHandler = useScrollHeader();

  const { Colors, isDark } = useTheme();

  const styles = createStyles(Colors);

  const { data: dashboardData } = useDashboardStats();

  const driverStatus: DriverStatus =
    (dashboardData?.stats?.status as DriverStatus) ?? 'OFFLINE';

  const isBusy = driverStatus === 'BUSY';

  const {
    location,
    loading: locationLoading,
    permissionStatus,
    showPermissionModal,
    requestPermission,
  } = useLocation();

  // Jobs arrive in real time over the driver socket only
  const jobs = useDriverJobsStore((s) => s.incomingOrders);

  const socket = useDriverJobsStore((s) => s.socket);

  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = useCallback(() => {
    if (!socket?.connected || !location) {
      Toast.show({
        type: 'error',
        text1: !location
          ? 'Waiting for your location'
          : 'Not connected, try again shortly',
      });
      return;
    }

    setRefreshing(true);

    const done = () => {
      clearTimeout(timeout);
      socket.off('sync-orders', done);
      setRefreshing(false);
    };

    const timeout = setTimeout(done, REFRESH_TIMEOUT);

    socket.once('sync-orders', done);

    socket.emit('request-sync', {
      lat: location.latitude,
      lng: location.longitude,
    });
  }, [socket, location]);

  const renderListHeader = useCallback(
    () => <RenderJobHeader jobs={jobs} />,
    [jobs],
  );

  const renderEmptyState = useCallback(() => <NoJobs />, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => <RenderJobCard item={item} />,
    [],
  );

  // Checking permission status
  if (permissionStatus === 'checking') {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <View
          style={[styles.iconWrapper, { backgroundColor: Colors.primaryLight }]}
        >
          <Ionicons
            name="location-outline"
            size={scale(36)}
            color={Colors.primary}
          />
        </View>

        <Text style={styles.loadingText}>Checking location access...</Text>
      </View>
    );
  }

  // Permission denied
  if (permissionStatus === 'denied') {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: 'center',
            alignItems: 'center',
            gap: scale(16),
          },
        ]}
      >
        <View
          style={[styles.iconWrapper, { backgroundColor: Colors.warningLight }]}
        >
          <Ionicons
            name="location-outline"
            size={scale(36)}
            color={Colors.warning}
          />
        </View>

        <Text style={[styles.title, { textAlign: 'center' }]}>
          Location Access Required
        </Text>

        <Text
          style={[
            styles.loadingText,
            {
              color: Colors.textSecondary,
              textAlign: 'center',
              fontFamily: Fonts.brandRegular,
            },
          ]}
        >
          C-Ride needs your location to show nearby delivery jobs. Please enable
          location access in your device settings.
        </Text>

        <LocationPermissionModal
          visible={showPermissionModal}
          onContinue={requestPermission}
        />
      </View>
    );
  }

  if (driverStatus === 'OFFLINE') {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <View style={{ gap: scale(12), alignItems: 'center', width: '100%' }}>
          <View style={styles.illustrationContainer}>
            <Image
              source={require('@/assets/images/offline.png')}
              style={{ width: 150, height: 150 }}
            />
          </View>

          <View style={{ gap: scale(8), marginBottom: scale(16) }}>
            <Text style={styles.title}>You are currently offline</Text>

            <Text style={styles.subtitle}>
              You won't be able to accept new jobs until you go online.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // BUSY state
  if (isBusy) {
    return (
      <>
        <LocationPermissionModal
          visible={showPermissionModal}
          onContinue={requestPermission}
        />

        <View
          style={[
            styles.container,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <View style={{ gap: scale(12), alignItems: 'center', width: '100%' }}>
            <View
              style={[
                styles.iconWrapper,
                {
                  backgroundColor: Colors.warningLight,
                },
              ]}
            >
              <Ionicons
                name="briefcase-outline"
                size={scale(36)}
                color={Colors.warning}
              />
            </View>

            <View style={{ gap: scale(8), marginBottom: scale(16) }}>
              <Text style={styles.title}>You currently have an active job</Text>

              <Text style={styles.subtitle}>
                Complete your current delivery before accepting new jobs.
              </Text>
            </View>

            <Button
              variant="green"
              style={{
                width: '100%',
              }}
              onPress={() => router.push('/(app)/(protected)/(tabs)/active')}
              rightIcon={
                <Ionicons
                  name="chevron-forward-outline"
                  size={16}
                  color={isDark ? Colors.text : Colors.background}
                />
              }
              // onPress={() => {
              //   router.push('/active-order');
              // }}
            >
              View Active Job
            </Button>
          </View>
        </View>
      </>
    );
  }

  // Loading state
  if (locationLoading) {
    return (
      <>
        <LocationPermissionModal
          visible={showPermissionModal}
          onContinue={requestPermission}
        />

        <LoadingJobs />
      </>
    );
  }

  return (
    <>
      <LocationPermissionModal
        visible={showPermissionModal}
        onContinue={requestPermission}
      />

      <Animated.FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.order_id}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + insets.top + scale(12),
          paddingBottom: scale(32),
          paddingHorizontal: scale(12),
        }}
        ItemSeparatorComponent={() => <View style={{ height: scale(14) }} />}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressViewOffset={HEADER_HEIGHT + insets.top}
          />
        }
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

    illustrationContainer: {
      alignItems: 'center',
      marginBottom: scale(30),
    },

    iconWrapper: {
      width: scale(72),
      height: scale(72),
      borderRadius: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: scale(16),
    },

    title: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
      textAlign: 'center',
      color: Colors.text,
    },
    subtitle: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandRegular,
      textAlign: 'center',
      color: Colors.textMuted,
    },

    loadingText: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
    },
  });
