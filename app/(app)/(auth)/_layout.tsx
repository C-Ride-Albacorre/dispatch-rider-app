import { Stack } from 'expo-router';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function AuthLayout() {
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
