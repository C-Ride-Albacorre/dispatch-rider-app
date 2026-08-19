
import { useTheme } from '@/hooks/use-theme';

import { Stack } from 'expo-router';
import { use } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function OnboardingLayout() {


  const { Colors } = useTheme();

  const insets = useSafeAreaInsets()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          // paddingLeft: insets.left,
          // paddingRight: insets.right,
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
