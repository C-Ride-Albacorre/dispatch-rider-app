import Footer from '@/components/layout/footer';
import {
  HEADER_HEIGHT,
  useScrollHeader,
} from '@/components/layout/scroll-header-context';
import { Fonts } from '@/constants/theme';
import HomeHeader from '@/features/home/components/header';
import NoDelivery from '@/features/home/components/no-delivery';
import NoRecentDelivery from '@/features/home/components/no-recent-delivery';
import RecentDeliveries from '@/features/home/components/recent-deliveries';
import StatFrame from '@/features/home/components/stat-frame';
import { useDashboardStats } from '@/features/home/use-fetch';
import { useTheme } from '@/hooks/use-theme';
import {
  ActiveOrderProps,
  useDriverJobsStore,
} from '@/store/driver-jobs-store';
import { scale } from '@/utils/scaling';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActiveDelivery from '@/features/home/components/active-delivery';
import { useDriverSocket } from '@/hooks/use-driver-socket';
import { useMapSocket } from '@/hooks/use-map-socket';
import { useEffect, useMemo } from 'react';

export type DriverStatus = 'ONLINE' | 'OFFLINE' | 'BUSY';

export default function Dashboard() {
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useDashboardStats();

  const stats = data?.stats;

  const driverInfo = data?.personalInfo;

  const driverStatus: DriverStatus =
    (stats?.status as DriverStatus) ?? 'OFFLINE';

  useDriverSocket(driverStatus);

  const activeOrder: ActiveOrderProps | null = useDriverJobsStore(
    (s) => s.activeOrder,
  );

  useMapSocket(activeOrder?.order_id);

  const etaToVendor = useDriverJobsStore((s) => s.tracking.eta.toVendor);

  const etaToCustomer = useDriverJobsStore((s) => s.tracking.eta.toCustomer);

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const scrollHandler = useScrollHeader();

  const etaText = useMemo(() => {
    const eta = etaToCustomer ?? etaToVendor;

    if (eta == null) return 'Waiting...';

    if (eta < 60) return `${eta} sec`;

    return `${Math.ceil(eta / 60)} min`;
  }, [etaToVendor, etaToCustomer]);

  const vendorPolyline: string | null = useDriverJobsStore(
    (s) => s.tracking.polylines.toVendor,
  );

  const customerPolyline: string | null = useDriverJobsStore(
    (s) => s.tracking.polylines.toCustomer,
  );

  const orderStatus = useDriverJobsStore((s) => s.tracking.orderStatus);

  const deliveryPhase = useMemo(() => {
    if (vendorPolyline) return 'TO_VENDOR';
    if (customerPolyline) return 'TO_CUSTOMER';
    if (orderStatus === 'PICKED_UP') return 'PICKED_UP';
    if (orderStatus === 'DELIVERED') return 'DELIVERED';
    return 'IDLE';
  }, [vendorPolyline, customerPolyline, orderStatus]);

  const isPickupActive = deliveryPhase === 'TO_VENDOR';
  const isCustomerActive = deliveryPhase === 'TO_CUSTOMER';

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingTop: HEADER_HEIGHT + insets.top }}
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
