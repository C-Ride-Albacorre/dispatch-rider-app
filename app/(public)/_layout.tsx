import { useTheme } from '@/hooks/use-theme';
import { Stack } from 'expo-router';

export default function PublicLayout() {
  const { Colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background,
          maxWidth: 600,
          alignSelf: 'center',
          width: '100%',
        },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
