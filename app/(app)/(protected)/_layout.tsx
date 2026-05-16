import { Stack, router } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/auth-store';

export default function DashboardLayout() {
  const { authStatus } = useAuthStore();

  useEffect(() => {
    if (authStatus !== 'AUTHENTICATED') {
      router.replace('/(app)/(auth)/login');
    }
  }, [authStatus]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaView>
  );
}
