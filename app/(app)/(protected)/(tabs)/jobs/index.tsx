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
import { useLocation } from '@/hooks/use-location';
import { useTheme } from '@/hooks/use-theme';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
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
    dismissPermissionModal,
  } = useLocation();

  // Only fetch jobs when NOT busy
  const { data, isLoading, error, refetch } = useAvailableJobs(
    location?.latitude,
    location?.longitude,
    {
      enabled: !isBusy,
    },
  );

  // Pull-to-refresh state
  const [refreshing, setRefreshing] = useState(false);

  // Track previous status to detect offline -> online transition
  const previousStatusRef = useRef(driverStatus);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Refetch jobs when driver comes back online
  useEffect(() => {
    if (previousStatusRef.current === 'OFFLINE' && driverStatus !== 'OFFLINE') {
      console.log('[JOBS] 🟢 Driver back online, refetching jobs...');
      refetch();
    }
    previousStatusRef.current = driverStatus;
  }, [driverStatus, refetch]);

  const apiJobs = data?.data ?? [];

  const socketJobs = useDriverJobsStore((s) => s.incomingOrders);

  // console.log('API Jobs:', apiJobs);
  console.log('Socket Jobs:', socketJobs);

  /**
   * Normalize job structure
   */
  const normalizeJob = (job: any) => ({
    ...job,

    order_id: job.order_id || job.orderId,

    store_name:
      job.store_name || job.storeName || job.pickup_location?.storeName,

    total_amount: job.total_amount || job.totalAmount || 0,

    deliveryFee: job.deliveryFee || job.delivery_fee || 0,

    store_lat: job.store_lat || job.pickup_location?.latitude,

    store_lng: job.store_lng || job.pickup_location?.longitude,
  });

  /**
   * Merge API jobs + realtime socket jobs
   * Socket jobs appear FIRST in the list
   */

  // Create a Set of socket job IDs for deduplication
  const socketJobIds = new Set(
    socketJobs.map((job: any) => normalizeJob(job).order_id),
  );

  // Start with socket jobs (first priority)
  const socketJobsNormalized = socketJobs.map((job: any) => normalizeJob(job));

  // Then add API jobs that aren't already in socket jobs
  const apiJobsNotInSocket = apiJobs
    .map((job: any) => normalizeJob(job))
    .filter((job: any) => !socketJobIds.has(job.order_id));

  console.log(' Socket Jobs:', socketJobs);
  console.log(' API Jobs Not in Socket:', apiJobsNotInSocket);

  const jobs = [...socketJobsNormalized, ...apiJobsNotInSocket];

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#A7F3D0' : '#6EE7B7'}
            progressViewOffset={HEADER_HEIGHT + insets.top + scale(12)}
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
      paddingHorizontal: scale(20),
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
      fontSize: normalize(12),
      fontFamily: Fonts.brandRegular,
      textAlign: 'center',
      color: Colors.textMuted,
    },

    loadingText: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
    },
  });
