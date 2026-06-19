import { create } from 'zustand';

import { BASE_URL } from '../config/base-api';

import {
  clearTokens,
  getAccessToken,
  getDriverId,
  getOnboardingStatus,
  getOnboardingStep,
  getRefreshToken,
  getVerificationEmail,
  getVerificationPhone,
  getVerificationToken,
} from '@/utils/token-storage';
import { unregisterDeviceToken } from '@/services/notifications/unregisterDeviceToken';
import { cleanupNotifications } from '@/services/notifications/initializeNotifications';
import { devtools } from 'zustand/middleware';

export type AuthStatus = 'UNAUTHENTICATED' | 'VERIFYING' | 'AUTHENTICATED';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;

  verificationToken: string | null;
  verificationEmail: string | null;
  verificationPhone: string | null;

  driverId: string | null;

  isEmailVerified: boolean;
  isPhoneVerified: boolean;

  onboardingStatus: string | null;
  onboardingStep: number | null;

  authStatus: 'UNAUTHENTICATED' | 'VERIFYING' | 'AUTHENTICATED';
  isHydrated: boolean;

  setAuth: (data: Partial<AuthState>) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      accessToken: null,

      refreshToken: null,

      verificationToken: null,

      verificationEmail: null,

      verificationPhone: null,

      driverId: null,

      onboardingStatus: null,

      onboardingStep: null,

      isEmailVerified: false,

      isPhoneVerified: false,

      authStatus: 'UNAUTHENTICATED',

      isHydrated: false,

      setAuth: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      logout: async () => {
        const { refreshToken } = useAuthStore.getState();

        cleanupNotifications();

        try {
          await unregisterDeviceToken();
        } catch (error) {
          console.log('Failed to unregister device token:', error);
        }

        try {
          await fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              refreshToken,
            }),
          });
        } catch (e) {
          console.error('Logout failed:', e);
        }

        await clearTokens();

        set({
          accessToken: null,
          refreshToken: null,

          verificationToken: null,
          verificationEmail: null,
          verificationPhone: null,

          onboardingStatus: null,
          onboardingStep: null,
          driverId: null,
          authStatus: 'UNAUTHENTICATED',
          isHydrated: true,
        });
      },
    }),
    {
      name: 'Auth Store',
    },
  ),
);

export const restoreAuth = async () => {
  try {
    const accessToken = await getAccessToken();

    const refreshToken = await getRefreshToken();

    const verificationToken = await getVerificationToken();

    const verificationEmail = await getVerificationEmail();

    const verificationPhone = await getVerificationPhone();

    const onboardingStatus = await getOnboardingStatus();

    const onboardingStep = await getOnboardingStep();

    const driverId = await getDriverId();

    // 🔥 AUTHENTICATED USER
    if (accessToken || refreshToken) {
      useAuthStore.getState().setAuth({
        accessToken,

        refreshToken,

        driverId,

        authStatus: 'AUTHENTICATED',

        onboardingStatus,

        onboardingStep: onboardingStep ? Number(onboardingStep) : null,

        isHydrated: true,
      });

      return;
    }

    // 🔥 VERIFYING USER
    if (verificationToken) {
      useAuthStore.getState().setAuth({
        verificationToken,

        verificationEmail,

        verificationPhone,

        isEmailVerified: false,

        isPhoneVerified: false,

        authStatus: 'VERIFYING',

        isHydrated: true,
      });

      return;
    }

    // 🔥 DEFAULT
    useAuthStore.getState().setAuth({
      authStatus: 'UNAUTHENTICATED',

      isHydrated: true,
    });
  } catch (error) {
    console.error('Restore auth failed:', error);

    await clearTokens();

    useAuthStore.getState().setAuth({
      accessToken: null,
      refreshToken: null,

      verificationToken: null,
      verificationEmail: null,
      verificationPhone: null,
      driverId: null,

      onboardingStatus: null,
      onboardingStep: null,

      authStatus: 'UNAUTHENTICATED',
      isHydrated: true,
    });
  }
};
