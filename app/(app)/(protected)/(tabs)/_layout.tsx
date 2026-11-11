import BackgroundLocationModal from '@/components/layout/background-location-modal';
import NotificationBanner from '@/components/layout/notification-banner';
import NotificationPermissionModal from '@/components/layout/notification-permission-modal';
import { Fonts } from '@/constants/theme';
import { useOrderTracking } from '@/features/active/use-fetch';
import { useDashboardStats } from '@/features/home/use-fetch';
import { useBackgroundLocation } from '@/hooks/use-background-location';
import { useDriverSocket } from '@/hooks/use-driver-socket';
import { useMapSocket } from '@/hooks/use-map-socket';
import { useNotificationListeners } from '@/hooks/use-notification-listeners';
import { useTheme } from '@/hooks/use-theme';
import { initializeNotifications } from '@/services/notifications/initializeNotifications';
import {
  ActiveOrderProps,
  DriverInfo,
  useDriverJobsStore,
} from '@/store/driver-jobs-store';
import {
  getActiveOrder,
  getNotificationPermissionDecision,
  saveNotificationPermissionDecision,
} from '@/utils/token-storage';
import { Tabs } from 'expo-router';
import {
  Briefcase,
  Home,
  Routing,
  User,
  Wallet,
  type Icon,
} from 'iconsax-react-nativejs';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type ColorValue } from 'react-native';

function tabIcon(TabIcon: Icon) {
  function TabBarIcon({
    focused,
    color,
    size,
  }: {
    focused: boolean;
    color: ColorValue;
    size: number;
  }) {
    return (
      <TabIcon
        size={size}
        color={color as string}
        variant={focused ? 'Bold' : 'Linear'}
      />
    );
  }
  return TabBarIcon;
}

export default function TabsLayout() {
  const { data: dashboardData } = useDashboardStats();
  const driverStatus =
    (dashboardData?.stats?.status as 'ONLINE' | 'OFFLINE' | 'BUSY') ??
    'OFFLINE';

  const activeOrder = useDriverJobsStore((s) => s.activeOrder);
  const setActiveOrder = useDriverJobsStore((s) => s.setActiveOrder);
  const setDriverLocation = useDriverJobsStore((s) => s.setDriverLocation);
  const setEta = useDriverJobsStore((s) => s.setEta);
  const setPolyline = useDriverJobsStore((s) => s.setPolyline);
  const setOrderStatus = useDriverJobsStore((s) => s.setOrderStatus);
  const setDriverInfo = useDriverJobsStore((s) => s.setDriverInfo);

  const [restoredOrderId, setRestoredOrderId] = useState<string | undefined>(
    undefined,
  );

  useNotificationListeners();

  useEffect(() => {
    void (async () => {
      const persisted = await getActiveOrder();

      if (persisted?.order_id) {
        setRestoredOrderId(persisted.order_id);
      }
    })();
  }, []);

  const { data: trackingSnapshot } = useOrderTracking();

  const activeOrderId =
    useDriverJobsStore((s) => s.activeOrder?.order_id) ??
    restoredOrderId ??
    trackingSnapshot?.data?.order?.id;

  useEffect(() => {
    const d = trackingSnapshot?.data;

    if (!d) return;

    if (!activeOrder && d.order) {
      const order: ActiveOrderProps = {
        order_id: d.order.id,
        order_number: d.order.number,
        order_status: d.order.status,
        store_id: d.store?.id ?? '',
        store_name: d.store?.name ?? '',
        store_logo: d.store?.logo ?? '',
        store_lat: d.store?.lat ?? 0,
        store_lng: d.store?.lng ?? 0,
        total_amount: d.order.totalAmount,
        pickup_location: d.order.pickupLocation,
        dropoff_location: d.order.dropoffLocation,
        items: d.order.items ?? [],
        created_at: d.order.createdAt,
        assigned_at: d.assignment?.assignedAt ?? '',
      };

      setActiveOrder(order);
    }

    if (d.driver) {
      const driverInfo: DriverInfo = {
        driver_id: d.driver.id,
        driver_name: d.driver.fullName,
        driver_photo: d.driver.photo ?? null,
        driver_phone: d.driver.phone,
        driver_rating: d.driver.rating,
        driver_total_trips: d.driver.totalTrips,
        driver_status: d.driver.status,
      };

      setDriverInfo(driverInfo);
    }

    const t = d.tracking;

    if (!t) return;

    const leg = t.leg === 'to-vendor' ? 'vendor' : 'customer';

    if (t.driverLocation) setDriverLocation(t.driverLocation);
    if (t.etaSeconds != null) setEta(leg, t.etaSeconds);
    if (t.polyline) setPolyline(leg, t.polyline);
    if (d.order?.status) setOrderStatus(d.order.status);
  }, [trackingSnapshot]);

  useDriverSocket(driverStatus, activeOrderId);
  useMapSocket(activeOrderId);

  const backgroundLocation = useBackgroundLocation(
    driverStatus,
    activeOrderId,
  );

  const [showNotificationModal, setShowNotificationModal] =
    useState<boolean>(false);

  const { Colors, isDark } = useTheme();

  useEffect(() => {
    const checkPermission = async () => {
      const decision = await getNotificationPermissionDecision();

      if (decision === 'allowed') {
        initializeNotifications();
      } else {
        setShowNotificationModal(true);
      }
    };

    checkPermission();
  }, []);

  return (
    <View style={styles.root}>
      <NotificationBanner />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: styles.label,
          tabBarStyle: {
            backgroundColor: isDark ? Colors.background : '#1A1A1A',
            borderTopColor: Colors.border,
          },
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{ title: 'Home', tabBarIcon: tabIcon(Home) }}
        />
        <Tabs.Screen
          name="jobs"
          options={{ title: 'Jobs', tabBarIcon: tabIcon(Briefcase) }}
        />
        <Tabs.Screen
          name="active"
          options={{ title: 'Active', tabBarIcon: tabIcon(Routing) }}
        />
        <Tabs.Screen
          name="earnings"
          options={{ title: 'Earnings', tabBarIcon: tabIcon(Wallet) }}
        />
        <Tabs.Screen
          name="profile"
          options={{ title: 'Profile', tabBarIcon: tabIcon(User) }}
        />
      </Tabs>

      <NotificationPermissionModal
        visible={showNotificationModal}
        onContinue={async () => {
          setShowNotificationModal(false);
          await saveNotificationPermissionDecision('allowed');
          initializeNotifications();
        }}
      />

      <BackgroundLocationModal
        visible={backgroundLocation.showDisclosure && !showNotificationModal}
        onContinue={backgroundLocation.onContinue}
        onDismiss={backgroundLocation.onDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  label: {
    fontFamily: Fonts.brandMedium,
    fontSize: 11,
  },

  tabItem: {
    paddingVertical: 8,
  },
});
