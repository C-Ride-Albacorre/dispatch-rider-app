import { useTheme } from '@/hooks/use-theme';
import { Stack } from 'expo-router';

export default function HomeLayout() {

  const { Colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
   

        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="history" />
    </Stack>
  );
}

