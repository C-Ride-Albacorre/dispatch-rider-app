import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Linking } from 'react-native';
import Toast from 'react-native-toast-message';

import {
  getBackgroundPermissionStatus,
  requestBackgroundPermission,
  startBackgroundLocation,
  stopBackgroundLocation,
  updateTrackingContext,
} from '@/services/location/background-location';
import { useAuthStore } from '@/store/auth-store';

type DriverStatus = 'ONLINE' | 'OFFLINE' | 'BUSY' | 'UNKNOWN';

export function useBackgroundLocation(
  status: DriverStatus | undefined,
  activeOrderId: string | null | undefined,
) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const driverId = useAuthStore((s) => s.driverId);

  const [showDisclosure, setShowDisclosure] = useState(false);

  const askedThisSession = useRef(false);

  const isOnline = status === 'ONLINE' || status === 'BUSY';

  const ensureRunning = useCallback(async () => {
    const permission = await getBackgroundPermissionStatus();

    if (permission === 'granted') {
      await startBackgroundLocation();
      return;
    }

    if (!askedThisSession.current) {
      askedThisSession.current = true;
      setShowDisclosure(true);
    }
  }, []);

  useEffect(() => {
    if (!accessToken || !driverId) return;

    void updateTrackingContext({
      accessToken,
      refreshToken,
      driverId,
      orderId: activeOrderId ?? null,
    });
  }, [accessToken, refreshToken, driverId, activeOrderId]);

  useEffect(() => {
    if (!accessToken || !driverId) return;

    if (isOnline) {
      void ensureRunning().catch(() => {},
      );
    } else {
      void stopBackgroundLocation().catch(() => {});
    }
  }, [isOnline, accessToken, driverId, ensureRunning]);

  useEffect(() => {
    if (!isOnline) return;

    const sub = AppState.addEventListener('change', async (next) => {
      if (next !== 'active') return;

      if ((await getBackgroundPermissionStatus()) === 'granted') {
        void startBackgroundLocation().catch(() => {});
      }
    });

    return () => sub.remove();
  }, [isOnline]);

  const onContinue = useCallback(async () => {
    setShowDisclosure(false);

    const result = await requestBackgroundPermission();

    if (result === 'granted') {
      await startBackgroundLocation();
      return;
    }

    Toast.show({
      type: 'info',
      text1: 'Location only works while the app is open',
      text2: 'Tap to allow location all the time in Settings',
      onPress: () => {
        Toast.hide();
        void Linking.openSettings();
      },
    });
  }, []);

  return { showDisclosure, onContinue };
}
