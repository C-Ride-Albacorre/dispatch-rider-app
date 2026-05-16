import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' },
        }}
      >
        <Stack.Screen name="login/index" />

        <Stack.Screen name="register/index" />

        <Stack.Screen name="forget-password/index" />

        <Stack.Screen name="reset-password/index" />

        <Stack.Screen name="verify/index" />
      </Stack>
    </SafeAreaView>
  );
}
