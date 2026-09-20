import { useTheme } from '@/hooks/use-theme';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VerifyLayout() {
  const insets = useSafeAreaInsets();

  const { Colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        sceneContainerStyle: {
          backgroundColor: '#000000',
        },
        contentStyle: {
          backgroundColor: Colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          maxWidth: 600,
          alignSelf: 'center',
          width: '100%',
        },

        gestureEnabled: true,

        fullScreenGestureEnabled: true,

        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="phone/index" />

      <Stack.Screen name="email/index" />
    </Stack>
  );
}
