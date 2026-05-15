import '../global.css';

import { Slot } from 'expo-router';

import * as SplashScreen from 'expo-splash-screen';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ReactQueryProvider from './providers/react-query-provider';

import { useEffect } from 'react';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import Toast from 'react-native-toast-message';

import { toastConfig } from '@/components/ui/input/custom-toast';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView className="flex-1">
      <ReactQueryProvider>
        <Slot />
      </ReactQueryProvider>

      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}
