import { create } from 'zustand';

import { BASE_URL } from '../config/base-api';

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getVerificationEmail,
  getVerificationPhone,
  getVerificationToken,
} from '@/utils/token-storage';

export type AuthStatus = 'UNAUTHENTICATED' | 'VERIFYING' | 'AUTHENTICATED';

type AuthState = {
  accessToken: string | null;

  refreshToken: string | null;

  verificationToken: string | null;

  verificationEmail: string | null;

  verificationPhone: string | null;

  authStatus: AuthStatus;

  isHydrated: boolean;

  setAuth: (data: Partial<AuthState>) => void;

  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,

  refreshToken: null,

  verificationToken: null,

  verificationEmail: null,

  verificationPhone: null,

  authStatus: 'UNAUTHENTICATED',

  isHydrated: false,

  setAuth: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  logout: async () => {
    const { refreshToken } = useAuthStore.getState();

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

      authStatus: 'UNAUTHENTICATED',

      isHydrated: true,
    });
  },
}));

export const restoreAuth = async () => {
  try {
    const accessToken = await getAccessToken();

    const refreshToken = await getRefreshToken();

    const verificationToken = await getVerificationToken();

    const verificationEmail = await getVerificationEmail();

    const verificationPhone = await getVerificationPhone();

    // 🔥 AUTHENTICATED USER
    if (accessToken && refreshToken) {
      useAuthStore.getState().setAuth({
        accessToken,

        refreshToken,

        authStatus: 'AUTHENTICATED',

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

      authStatus: 'UNAUTHENTICATED',

      isHydrated: true,
    });
  }
};
