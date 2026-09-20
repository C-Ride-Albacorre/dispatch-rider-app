import { useTheme } from '@/hooks/use-theme';
import { Stack } from 'expo-router';

export default function EarningsLayout() {
  const { Colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background,
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
