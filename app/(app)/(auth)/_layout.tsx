import { useTheme } from '@/hooks/use-theme';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AuthLayout() {
  const insets = useSafeAreaInsets();

  const { Colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
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
      }}
    >
      <Stack.Screen name="login/index" />

      <Stack.Screen name="register/index" />

      <Stack.Screen name="forget-password/index" />

      <Stack.Screen name="reset-password/index" />

      <Stack.Screen name="verify/index" />
    </Stack>
  );
}
