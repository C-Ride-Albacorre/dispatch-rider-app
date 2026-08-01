import NotificationBanner from '@/components/layout/notification-banner';
import NotificationPermissionModal from '@/components/layout/notification-permission-modal';
import {
  HEADER_HEIGHT,
  ScrollHeaderContext,
} from '@/components/layout/scroll-header-context';
import { Fonts } from '@/constants/theme';
import { useOrderTracking } from '@/features/active/use-fetch';
import AppHeader from '@/features/dashboard/components/app-header';
import { useDashboardStats } from '@/features/home/use-fetch';
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
import { normalize } from '@/utils/scaling';
import {
  getActiveOrder,
  getNotificationPermissionDecision,
  saveNotificationPermissionDecision,
} from '@/utils/token-storage';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  // On startup, restore the persisted orderId from SecureStore so we can
  // call the tracking endpoint even before the socket fires
  const [restoredOrderId, setRestoredOrderId] = useState<string | undefined>(
    undefined,
  );

  useNotificationListeners();

  useEffect(() => {
    void (async () => {
      const persisted = await getActiveOrder();

      console.log(
        '[TabsLayout] Restored persisted order from SecureStore:',
        persisted,
      );

      if (persisted?.order_id) {
        setRestoredOrderId(persisted.order_id);
      }
    })();
  }, []);

  const activeOrderId =
    useDriverJobsStore((s) => s.activeOrder?.order_id) ?? restoredOrderId;

  console.log(' [RestoredOrderId] activeOrderId:', restoredOrderId);

  // Fetch a tracking snapshot to pre-seed the map before the first socket event
  const { data: trackingSnapshot } = useOrderTracking(activeOrderId);

  useEffect(() => {
    const d = trackingSnapshot?.data;

    if (!d) return;

    // Hydrate activeOrder from tracking response if the store is empty
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

    // Hydrate driver info from tracking response
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

    // Seed tracking fields so the map renders immediately
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

  const [showNotificationModal, setShowNotificationModal] =
    useState<boolean>(false);
  const [showHeader, setShowHeader] = useState(true);

  const { Colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Shared values owned by the layout, consumed by child screens via context
  const headerTranslateY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
  }));

  useEffect(() => {
    const checkPermission = async () => {
      const decision = await getNotificationPermissionDecision();

      if (decision === 'allowed') {
        initializeNotifications();
      } else if (decision === null) {
        setShowNotificationModal(true);
      }
    };

    checkPermission();
  }, []);

  return (
    <ScrollHeaderContext.Provider
      value={{ headerTranslateY, lastScrollY, showHeader, setShowHeader }}
    >
      <View
        style={[
          styles.root,
          {
            backgroundColor: Colors.backgroundTertiary,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >

        <NotificationBanner />
        {/* ── Shared animated header ─────────────────────────────────────── */}
        {showHeader && (
          <Animated.View
            style={[
              styles.header,
              {
                backgroundColor: Colors.background,
                height: HEADER_HEIGHT + insets.top,
                paddingTop: insets.top,
              },
              headerAnimatedStyle,
            ]}
          >
            <AppHeader />
          </Animated.View>
        )}
        {/* ── Tab navigator ──────────────────────────────────────────────── */}
        <Tabs
          screenOptions={{
            tabBarHideOnKeyboard: true,
            tabBarLabelStyle: {
              fontFamily: Fonts.brandMedium,
              fontSize: normalize(12),
            },
            tabBarIconStyle: {
              marginTop: 4,
            },

            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textMuted,
            tabBarStyle: {
              backgroundColor: isDark ? Colors.background : '#1A1A1A',
              borderTopColor: Colors.border,
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              headerShown: false,
              title: 'Home',

              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? 'home' : 'home-outline'}
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="jobs"
            options={{
              title: 'Jobs',
              headerShown: false,
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? 'briefcase' : 'briefcase-outline'}
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="active"
            options={{
              title: 'Active',
              headerShown: false,
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? 'navigate' : 'navigate-outline'}
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          {/* <Tabs.Screen
            name="earnings"
            options={{
              title: 'Earnings',
              headerShown: false,
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? 'wallet' : 'wallet-outline'}
                  size={size}
                  color={color}
                />
              ),
            }}
          /> */}

          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              headerShown: false,
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? 'person' : 'person-outline'}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </View>

      <NotificationPermissionModal
        visible={showNotificationModal}
        onAllow={async () => {
          setShowNotificationModal(false);
          await saveNotificationPermissionDecision('allowed');
          initializeNotifications();
        }}
        onDeny={async () => {
          setShowNotificationModal(false);
          await saveNotificationPermissionDecision('denied');
        }}
      />
    </ScrollHeaderContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // height: HEADER_HEIGHT,
    zIndex: 10,
  },
});
