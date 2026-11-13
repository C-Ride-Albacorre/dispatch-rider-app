import AppFrame from '@/components/layout/app-frame';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts, Spacing } from '@/constants/theme';
import AppHeader from '@/features/dashboard/components/app-header';
import { useEarningsDashboard } from '@/features/earnings/use-fetch';
import { useOrderTracking } from '@/features/active/use-fetch';
import ActiveDelivery, {
  DeliveryPhase,
} from '@/features/home/components/active-delivery';
import ActiveDeliverySkeleton from '@/features/home/components/active-delivery-skeleton';
import HomeHeader from '@/features/home/components/header';
import NoDelivery from '@/features/home/components/no-delivery';
import RecentDeliveries from '@/features/home/components/recent-deliveries';
import StatFrame from '@/features/home/components/stat-frame';
import { useDashboardStats } from '@/features/home/use-fetch';
import { useTheme } from '@/hooks/use-theme';
import {
  ActiveOrderProps,
  useDriverJobsStore,
} from '@/store/driver-jobs-store';
import { useQueryClient } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

export type DriverStatus = 'ONLINE' | 'OFFLINE' | 'BUSY';

const greeting = (hour = new Date().getHours()) =>
  hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

function normalizeStatus(status?: string): DeliveryPhase {
  if (!status) return 'IDLE';

  switch (status) {
    case 'ORDER_ASSIGNED':
    case 'ASSIGNED':
      return 'TO_VENDOR';

    case 'PICKED_UP':
    case 'IN_TRANSIT':
      return 'TO_CUSTOMER';

    case 'DELIVERED':
      return 'DELIVERED';

    default:
      return 'IDLE';
  }
}

export default function Dashboard() {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useDashboardStats();

  const {
    data: earningsData,
    isLoading: isEarningsLoading,
    refetch: refetchEarnings,
  } = useEarningsDashboard('TODAY');

  const stats = data?.stats;
  const driverInfo = data?.personalInfo;

  const driverStatus: DriverStatus =
    (stats?.status as DriverStatus) ?? 'OFFLINE';

  const activeOrder: ActiveOrderProps | null = useDriverJobsStore(
    (s) => s.activeOrder,
  );
  // Shared with the tabs layout via the React Query cache, so no extra request.
  const { isLoading: isActiveOrderLoading } = useOrderTracking();
  const etaToVendor = useDriverJobsStore((s) => s.etaToVendor);
  const etaToCustomer = useDriverJobsStore((s) => s.etaToCustomer);

  const deliveryPhase = useMemo(
    () => normalizeStatus(activeOrder?.order_status),
    [activeOrder?.order_status],
  );

  const firstName = driverInfo?.firstName?.trim();

  // Only show the pull-to-refresh spinner for a refresh the user started.
  // Tying it to isFetching made it appear (and push the content down) on every
  // app launch and background refetch.
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetch(),
        refetchEarnings(),
        queryClient.invalidateQueries({ queryKey: ['recent-deliveries'] }),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, refetchEarnings, queryClient]);

  return (
    <ThemedView style={styles.flex}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.white}
          />
        }
      >
        <AppFrame
          header={<AppHeader />}
          badge={
            driverStatus === 'ONLINE'
              ? 'Online'
              : driverStatus === 'BUSY'
                ? 'On a delivery'
                : 'Offline'
          }
          badgeMuted={driverStatus === 'OFFLINE'}
          headline={
            <>
              {greeting()}
              {firstName ? ',\n' : ''}
              {!!firstName && (
                <ThemedText style={styles.headlineName} themeColor="primary">
                  {firstName}
                </ThemedText>
              )}
            </>
          }
        >
          <HomeHeader driverStatus={driverStatus} />
          <StatFrame
            stats={stats}
            earnings={earningsData?.summary}
            isLoading={isLoading || isEarningsLoading}
          />
        </AppFrame>

        <View style={styles.section}>
          {activeOrder ? (
            <ActiveDelivery
              activeOrder={activeOrder}
              phase={deliveryPhase}
              etaVendor={etaToVendor}
              etaCustomer={etaToCustomer}
            />
          ) : isActiveOrderLoading ? (
            <ActiveDeliverySkeleton />
          ) : (
            <NoDelivery />
          )}

          <RecentDeliveries />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    content: {
      paddingBottom: Spacing.five,
    },

    headlineName: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 28,
      lineHeight: 36,
      textTransform: 'capitalize',
    },

    section: {
      gap: Spacing.five,
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.five,
    },
  });
