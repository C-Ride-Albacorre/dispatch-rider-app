import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'white',
          },

          gestureEnabled: true,

          fullScreenGestureEnabled: true,

          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="phone/index" />

        <Stack.Screen name="email/index" />
      </Stack>
    </SafeAreaView>
  );
}
