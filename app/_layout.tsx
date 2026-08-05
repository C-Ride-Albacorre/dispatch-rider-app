

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';
import ReactQueryProvider from '../providers/react-query-provider';

import { toastConfig } from '@/components/ui/input/custom-toast';

import { restoreAuth, useAuthStore } from '@/store/auth-store';

import AuthGate from '@/features/auth/components/auth-gate';
import ExpiredTokenModal from '@/features/verify/components/expired-token-modal';

import { usePathname } from 'expo-router';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import OfflineScreen from '@/features/auth/components/offline-screen';
import messaging from '@react-native-firebase/messaging';

SplashScreen.preventAutoHideAsync();





messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Background notification:', remoteMessage);
});



export default function RootLayout() {
  console.log('ROOT LAYOUT MOUNTED');

  const isHydrated = useAuthStore((state) => state.isHydrated);
  // const authStatus = useAuthStore((state) => state.authStatus);
  const verificationToken = useAuthStore((state) => state.verificationToken);
  const verificationEmail = useAuthStore((state) => state.verificationEmail);
  const verificationPhone = useAuthStore((state) => state.verificationPhone);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const pathname = usePathname();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    async function checkConnection() {
      const state = await NetInfo.fetch();

      setIsConnected(Boolean(state.isConnected && state.isInternetReachable));
    }

    checkConnection();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(Boolean(state.isConnected && state.isInternetReachable));
    });

    return unsubscribe;
  }, []);

  const appReady = fontsLoaded && isHydrated && isConnected !== null;

  // Only restore auth if not on a verification route
  useEffect(() => {
    const isVerificationRoute =
      pathname.startsWith('/(verify)') ||
      pathname.startsWith('/(app)/(verify)');
    if (!isVerificationRoute) {
      console.log('RESTORE AUTH STARTED');

      restoreAuth();
    } else {
      // On verification route, check for verification data
      if (!verificationToken || (!verificationEmail && !verificationPhone)) {
        setShowExpiredModal(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Hide native splash ONLY after everything is ready
  useEffect(() => {
    async function hideSplash() {
      if (appReady) {
        await SplashScreen.hideAsync();
      }
    }

    hideSplash();
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  console.log({
    fontsLoaded,
    isHydrated,
    authStatus: useAuthStore.getState().authStatus,
  });

  if (!isConnected) {
    return (
      <OfflineScreen
        onRetry={async () => {
          const state = await NetInfo.fetch();

          setIsConnected(
            Boolean(state.isConnected && state.isInternetReachable),
          );
        }}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReactQueryProvider>
        <AuthGate>
          <Slot />
        </AuthGate>
        <ExpiredTokenModal
          showExpiredModal={showExpiredModal}
          setShowExpiredModal={setShowExpiredModal}
        />
      </ReactQueryProvider>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}
