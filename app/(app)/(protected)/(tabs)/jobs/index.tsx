import LocationPermissionModal from '@/components/layout/location-permission-modal';
import ScreenHeader from '@/components/layout/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useDashboardStats } from '@/features/home/use-fetch';
import LoadingJobs from '@/features/jobs/components/loading-jobs';
import NoJobs from '@/features/jobs/components/no-job';
import RenderJobCard from '@/features/jobs/components/render-job-card';
import RenderJobHeader from '@/features/jobs/components/render-job-header';
import { useLocation } from '@/hooks/use-location';
import { useTheme } from '@/hooks/use-theme';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, View } from 'react-native';
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

/** Tab chrome shared by every state of the Jobs screen */
function JobsShell({
  subtitle,
  children,
}: {
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <ThemedView style={styles.flex}>
      <StatusBar style="auto" />
      <ScreenHeader title="Jobs" subtitle={subtitle} />
      {children}
    </ThemedView>
  );
}

export default function Jobs() {
  const router = useRouter();

  const { Colors } = useTheme();

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
      <JobsShell subtitle="Checking location access">
        <View style={styles.centered}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: Colors.primaryExtraLight },
            ]}
          >
            <Ionicons name="location-outline" size={28} color={Colors.primary} />
          </View>

          <ThemedText style={styles.loadingText} themeColor="textSecondary">
            Checking location access...
          </ThemedText>
        </View>
      </JobsShell>
    );
  }

  // Permission denied
  if (permissionStatus === 'denied') {
    return (
      <JobsShell subtitle="Location access needed">
        <View style={styles.centered}>
          <View
            style={[styles.iconWrapper, { backgroundColor: Colors.warningLight }]}
          >
            <Ionicons name="location-outline" size={28} color={Colors.warning} />
          </View>

          <View style={styles.textGroup}>
            <ThemedText style={styles.title}>Location Access Required</ThemedText>

            <ThemedText style={styles.subtitle} themeColor="textSecondary">
              C-Ride needs your location to show nearby delivery jobs. Please
              enable location access in your device settings.
            </ThemedText>
          </View>

          <LocationPermissionModal
            visible={showPermissionModal}
            onContinue={requestPermission}
          />
        </View>
      </JobsShell>
    );
  }

  if (driverStatus === 'OFFLINE') {
    return (
      <JobsShell subtitle="Go online to receive requests">
        <View style={styles.centered}>
          <Image
            source={require('@/assets/images/offline.png')}
            style={styles.illustration}
          />

          <View style={styles.textGroup}>
            <ThemedText style={styles.title}>You are currently offline</ThemedText>

            <ThemedText style={styles.subtitle} themeColor="textMuted">
              You won't be able to accept new jobs until you go online.
            </ThemedText>
          </View>
        </View>
      </JobsShell>
    );
  }

  // BUSY state
  if (isBusy) {
    return (
      <JobsShell subtitle="You're on a delivery">
        <LocationPermissionModal
          visible={showPermissionModal}
          onContinue={requestPermission}
        />

        <View style={styles.centered}>
          <View
            style={[styles.iconWrapper, { backgroundColor: Colors.warningLight }]}
          >
            <Ionicons
              name="briefcase-outline"
              size={28}
              color={Colors.warning}
            />
          </View>

          <View style={styles.textGroup}>
            <ThemedText style={styles.title}>
              You currently have an active job
            </ThemedText>

            <ThemedText style={styles.subtitle} themeColor="textMuted">
              Complete your current delivery before accepting new jobs.
            </ThemedText>
          </View>

          <Button
            variant="green"
            size="lg"
            style={styles.cta}
            onPress={() => router.push('/(app)/(protected)/(tabs)/active')}
            rightIcon={
              <Ionicons
                name="chevron-forward-outline"
                size={16}
                color={Colors.white}
              />
            }
            // onPress={() => {
            //   router.push('/active-order');
            // }}
          >
            View Active Job
          </Button>
        </View>
      </JobsShell>
    );
  }

  // Loading state
  if (locationLoading) {
    return (
      <JobsShell subtitle="Finding requests near you">
        <LocationPermissionModal
          visible={showPermissionModal}
          onContinue={requestPermission}
        />

        <LoadingJobs />
      </JobsShell>
    );
  }

  return (
    <JobsShell subtitle="Delivery requests near you">
      <LocationPermissionModal
        visible={showPermissionModal}
        onContinue={requestPermission}
      />

      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.order_id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />
    </JobsShell>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  list: {
    flexGrow: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
  },

  separator: {
    height: 12,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },

  illustration: {
    width: 150,
    height: 150,
  },

  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textGroup: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
  },

  title: {
    fontFamily: Fonts.brandSemiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: Fonts.brandRegular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  loadingText: {
    fontFamily: Fonts.brandMedium,
    fontSize: 14,
    lineHeight: 20,
  },

  cta: {
    width: '100%',
    marginTop: Spacing.two,
  },
});
