import {
  HEADER_HEIGHT,
  ScrollHeaderContext,
} from '@/components/layout/scroll-header-context';
import { Fonts } from '@/constants/theme';
import AppHeader from '@/features/dashboard/components/app-header';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const { Colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Shared values owned by the layout, consumed by child screens via context
  const headerTranslateY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
  }));

  return (
    <ScrollHeaderContext.Provider value={{ headerTranslateY, lastScrollY }}>
      <View style={[styles.root , { backgroundColor: Colors.backgroundTertiary }]}>
        {/* ── Shared animated header ─────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: Colors.background },
            headerAnimatedStyle,
          ]}
        >
          <AppHeader />
        </Animated.View>

        {/* ── Tab navigator ──────────────────────────────────────────────── */}
        <Tabs
          screenOptions={{
            tabBarHideOnKeyboard: true,
            tabBarLabelStyle: {
              fontFamily: Fonts.brandMedium,
              fontSize: 12,
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

          <Tabs.Screen
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
          />

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
    height: HEADER_HEIGHT,
    zIndex: 10,
  },
});
