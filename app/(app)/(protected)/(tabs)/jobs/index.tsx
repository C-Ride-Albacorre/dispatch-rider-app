import LocationPermissionModal from '@/components/layout/location-permission-modal';
import {
  HEADER_HEIGHT,
  useHeaderReset,
  useScrollHeader,
} from '@/components/layout/scroll-header-context';
import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import { useDashboardStats } from '@/features/home/use-fetch';
import ErrorContent from '@/features/jobs/components/error';
import LoadingJobs from '@/features/jobs/components/loading-jobs';
import NoJobs from '@/features/jobs/components/no-job';
import RenderJobCard from '@/features/jobs/components/render-job-card';
import RenderJobHeader from '@/features/jobs/components/render-job-header';
import { useAvailableJobs } from '@/features/jobs/use-fetch';
import { useDriverSocket } from '@/hooks/use-driver-socket';
import { useLocation } from '@/hooks/use-location';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DriverStatus } from '../home';

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

  const { Colors } = useTheme();

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
    dismissPermissionModal,
  } = useLocation();

  // Only connect socket when ONLINE
  useDriverSocket(driverStatus);

  // Only fetch jobs when NOT busy
  const { data, isLoading, error } = useAvailableJobs(
    location?.latitude,
    location?.longitude,
    {
      enabled: !isBusy,
    },
  );

  const apiJobs = data?.data ?? [];

  const socketJobs = useDriverJobsStore((s) => s.incomingOrders);

  /**
   * Normalize job structure
   */
  const normalizeJob = (job: any) => ({
    ...job,

    order_id: job.order_id || job.orderId,

    store_name:
      job.store_name || job.storeName || job.pickup_location?.storeName,

    total_amount: job.total_amount || job.totalAmount || 0,

    store_lat: job.store_lat || job.pickup_location?.latitude,

    store_lng: job.store_lng || job.pickup_location?.longitude,
  });

  /**
   * Merge API jobs + realtime socket jobs
   */
  const jobsMap = new Map<string, any>();

  // API jobs
  apiJobs.forEach((job: any) => {
    const normalized = normalizeJob(job);

    jobsMap.set(normalized.order_id, normalized);
  });

  // Socket jobs override API jobs
  socketJobs.forEach((job: any) => {
    const normalized = normalizeJob(job);

    jobsMap.set(normalized.order_id, normalized);
  });

  const jobs = Array.from(jobsMap.values());

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
          style={[styles.iconWrapper, { backgroundColor: Colors.primaryLight }]}
        >
          <Ionicons
            name="location-outline"
            size={scale(36)}
            color={Colors.textMuted}
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
          onAllow={requestPermission}
          onDeny={dismissPermissionModal}
        />
      </View>
    );
  }

  // BUSY state
  if (isBusy) {
    return (
      <>
        <LocationPermissionModal
          visible={showPermissionModal}
          onAllow={requestPermission}
          onDeny={dismissPermissionModal}
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
              // onPress={() => {
              //   router.push('/active-order');
              // }}
            >
              View Active Order
            </Button>
          </View>
        </View>
      </>
    );
  }

  // Loading state
  if (locationLoading || isLoading) {
    return (
      <>
        <LocationPermissionModal
          visible={showPermissionModal}
          onAllow={requestPermission}
          onDeny={dismissPermissionModal}
        />

        <LoadingJobs />
      </>
    );
  }

  // Error state
  if (error) {
    return <ErrorContent error={error} />;
  }

  return (
    <>
      <LocationPermissionModal
        visible={showPermissionModal}
        onAllow={requestPermission}
        onDeny={dismissPermissionModal}
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
          paddingHorizontal: scale(16),
        }}
        ItemSeparatorComponent={() => <View style={{ height: scale(14) }} />}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={!isLoading && renderEmptyState}
      />
    </>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(20),
      paddingVertical: scale(24),
      backgroundColor: Colors.background,
      gap: scale(16),
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
