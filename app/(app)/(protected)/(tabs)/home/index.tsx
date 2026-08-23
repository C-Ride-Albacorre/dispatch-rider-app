import {
  HEADER_HEIGHT,
  useScrollHeader,
} from '@/components/layout/scroll-header-context';
import { Fonts } from '@/constants/theme';
import ActiveDelivery from '@/features/home/components/active-delivery';
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
import { scale } from '@/utils/scaling';
import { useMemo } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type DriverStatus = 'ONLINE' | 'OFFLINE' | 'BUSY';

export default function Dashboard() {
  const insets = useSafeAreaInsets();

  const { data, isLoading, isFetching, refetch } = useDashboardStats();

  const stats = data?.stats;

  const driverInfo = data?.personalInfo;

  const driverStatus: DriverStatus =
    (stats?.status as DriverStatus) ?? 'OFFLINE';

  const activeOrder: ActiveOrderProps | null = useDriverJobsStore(
    (s) => s.activeOrder,
  );

  const etaToVendor = useDriverJobsStore((s) => s.etaToVendor);

  const etaToCustomer = useDriverJobsStore((s) => s.etaToCustomer);

  const { Colors, isDark } = useTheme();

  const styles = createStyles(Colors);

  const scrollHandler = useScrollHeader();

  function normalizeStatus(status?: string) {
    if (!status) return 'IDLE';

    switch (status) {
      case 'ORDER_ASSIGNED':
      case 'ASSIGNED':
        return 'TO_VENDOR';

      case 'PICKED_UP':
        return 'TO_CUSTOMER';

      case 'DELIVERED':
        return 'DELIVERED';

      default:
        return 'IDLE';
    }
  }

  const deliveryPhase = useMemo(() => {
    return normalizeStatus(activeOrder?.order_status);
  }, [activeOrder?.order_status]);

  const isPickupActive = deliveryPhase === 'TO_VENDOR';
  const isCustomerActive =
    deliveryPhase === 'TO_CUSTOMER' || deliveryPhase === 'DELIVERED';

  const etaText = useMemo(() => {
    const etaValue =
      deliveryPhase === 'TO_CUSTOMER' ? etaToCustomer : etaToVendor;

    if (etaValue == null) return 'Waiting...';

    if (etaValue < 60) return `${etaValue} sec`;

    return `${Math.ceil(etaValue / 60)} min`;
  }, [etaToCustomer, etaToVendor, deliveryPhase]);

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingTop: HEADER_HEIGHT + insets.top }}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={refetch}
          tintColor={isDark ? '#A7F3D0' : '#6EE7B7'}
          progressViewOffset={HEADER_HEIGHT + insets.top + scale(12)}
        />
      }
    >
      <View style={styles.container}>
        <HomeHeader driverStatus={driverStatus} driverInfo={driverInfo} />

        <StatFrame stats={stats} isLoading={isLoading} />

        {!activeOrder ? (
          <NoDelivery />
        ) : (
          <ActiveDelivery
            activeOrder={activeOrder}
            etaText={etaText}
            isPickupActive={isPickupActive}
            isCustomerActive={isCustomerActive}
            etaVendor={etaToVendor}
            etaCustomer={etaToCustomer}
          />
        )}

        <RecentDeliveries />
      </View>

      {/* <Footer /> */}
    </Animated.ScrollView>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(20),
      backgroundColor: Colors.background,
      gap: scale(16),
      paddingVertical: scale(24),
    },

    tabContent: {
      gap: scale(24),
    },

    tabContainer: {
      flexDirection: 'row',
      borderRadius: scale(14),
      backgroundColor: Colors.inputBackground,
      padding: scale(4),
      marginVertical: scale(20),
      gap: scale(4),
    },

    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scale(8),
      borderRadius: scale(10),
      gap: scale(6),
    },

    activeTab: {
      backgroundColor: '#fff',
      color: Colors.text,
    },
    tabText: {
      fontSize: 14,
      fontFamily: Fonts.brandMedium,
      color: Colors.textSecondary,
    },

    activeTabText: {
      color: Colors.text,
    },
  });
