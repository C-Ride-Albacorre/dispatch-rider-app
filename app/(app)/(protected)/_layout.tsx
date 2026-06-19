import { Stack, router, useSegments } from 'expo-router';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/auth-store';

export default function ProtectedLayout() {
  const { authStatus, onboardingStatus, onboardingStep } = useAuthStore();
  const segments = useSegments();

  useEffect(() => {
    if (authStatus !== 'AUTHENTICATED') {
      router.replace('/(app)/(auth)/login');
      return;
    }

    const isOnboarding = segments.includes('onboarding' as never);

    if (onboardingStatus !== 'COMPLETED' && !isOnboarding) {
      const completedStep = Number(onboardingStep ?? 0);
      router.replace(
        `/(app)/(protected)/onboarding?step=${completedStep + 1}&resumeStep=${completedStep}`,
      );
    }
  }, [authStatus, onboardingStatus, onboardingStep, segments]);

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
      <Stack.Screen name="(main)" />

      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
