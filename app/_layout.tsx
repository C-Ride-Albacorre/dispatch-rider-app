import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { DefaultTheme, Slot, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import '../global.css';
import ReactQueryProvider from '../providers/react-query-provider';

import { restoreAuth, useAuthStore } from '@/store/auth-store';

import AuthGate from '@/features/auth/components/auth-gate';
import ExpiredTokenModal from '@/features/verify/components/expired-token-modal';

import AnimatedSplash from '@/components/layout/animated-splash';
import OfflineBanner from '@/components/layout/offline-banner';
import { setupNotificationChannels } from '@/services/notifications/setupNotificationChannels';
import NetInfo from '@react-native-community/netinfo';
import { usePathname } from 'expo-router';
import { AppToast } from '@/components/ui/toast';

SplashScreen.preventAutoHideAsync();

SystemUI.setBackgroundColorAsync('#000000');

const AppTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#1A1A1A' },
};

setupNotificationChannels();

export default function RootLayout() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  // const authStatus = useAuthStore((state) => state.authStatus);
  const verificationToken = useAuthStore((state) => state.verificationToken);
  const verificationEmail = useAuthStore((state) => state.verificationEmail);
  const verificationPhone = useAuthStore((state) => state.verificationPhone);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [splashFinished, setSplashFinished] = useState(false);
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

  const appReady = fontsLoaded && isHydrated;

  useEffect(() => {
    const isVerificationRoute =
      pathname.startsWith('/(verify)') ||
      pathname.startsWith('/(app)/(verify)');
    if (!isVerificationRoute) {
      restoreAuth();
    } else {
      if (!verificationToken || (!verificationEmail && !verificationPhone)) {
        setShowExpiredModal(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // if (!isConnected) {
  //   return (
  //     <OfflineScreen
  //       onRetry={async () => {
  //         const state = await NetInfo.fetch();

  //         setIsConnected(
  //           Boolean(state.isConnected && state.isInternetReachable),
  //         );
  //       }}
  //     />
  //   );
  // }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#1A1A1A' }}>
      <KeyboardProvider>
      {appReady && (
        <>
          <ReactQueryProvider>
            <ThemeProvider value={AppTheme}>
              <AuthGate>
                <Slot />
              </AuthGate>
            </ThemeProvider>

            <ExpiredTokenModal
              showExpiredModal={showExpiredModal}
              setShowExpiredModal={setShowExpiredModal}
            />

            {!isConnected && (
              <OfflineBanner
                onRetry={async () => {
                  const state = await NetInfo.fetch();

                  setIsConnected(
                    Boolean(state.isConnected && state.isInternetReachable),
                  );
                }}
              />
            )}
          </ReactQueryProvider>

          <AppToast />
        </>
      )}

      {!splashFinished && (
        <AnimatedSplash
          ready={appReady}
          onFinish={() => setSplashFinished(true)}
        />
      )}
      </KeyboardProvider>
    </GestureHandlerRootView>
  );

  // return (
  //   <GestureHandlerRootView style={{ flex: 1 }}>
  //     <ReactQueryProvider>
  //       <AuthGate>
  //         <Slot />
  //       </AuthGate>
  //       <ExpiredTokenModal
  //         showExpiredModal={showExpiredModal}
  //         setShowExpiredModal={setShowExpiredModal}
  //       />
  //     </ReactQueryProvider>
  //     <AppToast />
  //   </GestureHandlerRootView>
  // );
}
