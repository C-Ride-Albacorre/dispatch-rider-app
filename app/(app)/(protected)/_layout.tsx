import { Stack, router } from 'expo-router';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/auth-store';

export default function DashboardLayout() {
  const { authStatus } = useAuthStore();

  useEffect(() => {
    if (authStatus !== 'AUTHENTICATED') {
      router.replace('/(app)/(auth)/login');
    }
  }, [authStatus]);

  const insets = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'white',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        gestureEnabled: true,

        fullScreenGestureEnabled: true,

        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
