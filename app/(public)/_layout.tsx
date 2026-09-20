import { Stack } from 'expo-router';

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        sceneContainerStyle: {
          backgroundColor: '#000000',
        },
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'white',
            maxWidth: 600,
            alignSelf: 'center',
            width: '100%',
          },
        }}
      />
    </Stack>
  );
}
