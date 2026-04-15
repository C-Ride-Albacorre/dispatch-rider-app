import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardLayout() {
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
