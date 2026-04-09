import '../global.css';
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReactQueryProvider from './providers/react-query-provider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <ReactQueryProvider>
        <Slot />
      </ReactQueryProvider>
    </GestureHandlerRootView>
  );
}