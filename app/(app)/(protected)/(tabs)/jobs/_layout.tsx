import { useTheme } from '@/hooks/use-theme';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function JobsLayout() {
  const { Colors } = useTheme();

  const insets = useSafeAreaInsets();
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

      <Stack.Screen
        name="[id]"
        options={{
          animation: 'slide_from_bottom',
        }}
      />

      {/* <Stack.Screen
        name="[id]"
          options={{
          presentation: 'formSheet',
          animation: 'slide_from_bottom',
          title: '',
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
          headerShown: false,
           sheetAllowedDetents: [0.8],
          
        }}
      /> */}
    </Stack>
  );
}
