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

import NotificationPermissionModal from '@/components/layout/notification-permission-modal';
import AuthGate from '@/features/auth/components/auth-gate';
import ExpiredTokenModal from '@/features/verify/components/expired-token-modal';
import {
  cleanupNotifications,
  initializeNotifications,
} from '@/services/notifications/initializeNotifications';
import {
  getNotificationPermissionDecision,
  saveNotificationPermissionDecision,
} from '@/utils/token-storage';
import { usePathname } from 'expo-router';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log('ROOT LAYOUT MOUNTED');

  const isHydrated = useAuthStore((state) => state.isHydrated);
  const authStatus = useAuthStore((state) => state.authStatus);
  const verificationToken = useAuthStore((state) => state.verificationToken);
  const verificationEmail = useAuthStore((state) => state.verificationEmail);
  const verificationPhone = useAuthStore((state) => state.verificationPhone);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
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
    if (fontsLoaded && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    if (authStatus === 'AUTHENTICATED') {
      getNotificationPermissionDecision().then((decision) => {
        if (decision === 'allowed') {
          // Already consented before — initialise silently
          initializeNotifications();
        } else if (decision === null) {
          // First time — show our pre-permission modal
          setShowNotificationModal(true);
        }
        // 'denied' → user said Not Now before, respect that
      });
    }

    if (authStatus === 'UNAUTHENTICATED') {
      cleanupNotifications();
    }
  }, [authStatus, isHydrated]);

  console.log({
    fontsLoaded,
    isHydrated,
    authStatus: useAuthStore.getState().authStatus,
  });

  // Prevent flashing
  if (!fontsLoaded || !isHydrated) {
    console.log('fontsLoaded', fontsLoaded);
    console.log('isHydrated', isHydrated);
    console.log('authStatus', useAuthStore.getState().authStatus);

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
        <NotificationPermissionModal
          visible={showNotificationModal}
          onAllow={async () => {
            setShowNotificationModal(false);
            await saveNotificationPermissionDecision('allowed');
            initializeNotifications();
          }}
          onDeny={async () => {
            setShowNotificationModal(false);
            await saveNotificationPermissionDecision('denied');
          }}
        />
      </ReactQueryProvider>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}
