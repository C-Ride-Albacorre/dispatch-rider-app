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
import ReactQueryProvider from './providers/react-query-provider';

import { toastConfig } from '@/components/ui/input/custom-toast';

import { restoreAuth, useAuthStore } from '@/store/auth-store';

import AuthGate from '@/features/auth/components/auth-gate';
import ExpiredTokenModal from '@/features/verify/components/expired-token-modal';
import { usePathname } from 'expo-router';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const verificationToken = useAuthStore((state) => state.verificationToken);
  const verificationEmail = useAuthStore((state) => state.verificationEmail);
  const verificationPhone = useAuthStore((state) => state.verificationPhone);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const pathname = usePathname();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Only restore auth if not on a verification route
  useEffect(() => {
    const isVerificationRoute =
      pathname.startsWith('/(verify)') ||
      pathname.startsWith('/(app)/(verify)');
    if (!isVerificationRoute) {
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
    if (fontsLoaded && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isHydrated]);

  // Prevent flashing
  if (!fontsLoaded || !isHydrated) {
    return null;
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
