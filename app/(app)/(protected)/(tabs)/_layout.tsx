import NotificationPermissionModal from '@/components/layout/notification-permission-modal';
import {
  HEADER_HEIGHT,
  ScrollHeaderContext,
} from '@/components/layout/scroll-header-context';
import { Fonts } from '@/constants/theme';
import AppHeader from '@/features/dashboard/components/app-header';
import { useTheme } from '@/hooks/use-theme';
import { initializeNotifications } from '@/services/notifications/initializeNotifications';
import { normalize } from '@/utils/scaling';
import { getNotificationPermissionDecision, saveNotificationPermissionDecision } from '@/utils/token-storage';
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

  
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
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
    <ScrollHeaderContext.Provider value={{ headerTranslateY, lastScrollY ,  showHeader,
    setShowHeader,}}>
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
        {/* ── Shared animated header ─────────────────────────────────────── */}
      {  showHeader &&  <Animated.View
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
}
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
