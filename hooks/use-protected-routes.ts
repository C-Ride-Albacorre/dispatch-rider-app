import { useAuthStore } from '@/store/auth-store';

import { useRouter, useSegments } from 'expo-router';

import { useEffect } from 'react';

export const useProtectedRoute = () => {
  const { authStatus, verificationToken, isHydrated } = useAuthStore();

  const segments = useSegments();

  const router = useRouter();

  useEffect(() => {
    // 🔥 WAIT FOR HYDRATION
    if (!isHydrated) return;

    const segment = segments[0];

    const inAuthGroup = segment === '(auth)';

    const inVerifyGroup = segment === '(verify)';

    const inPublicGroup = segment === '(public)';

    // 🔥 UNAUTHENTICATED
    if (authStatus === 'UNAUTHENTICATED') {
      if (!inAuthGroup && !inVerifyGroup) {
        router.replace('/(auth)/login');
      }

      return;
    }

    // 🔥 VERIFYING
    if (authStatus === 'VERIFYING') {
      if (!verificationToken) {
        router.replace('/(auth)/login');

        return;
      }

      if (!inVerifyGroup) {
        router.replace('/(verify)/phone');
      }

      return;
    }

    // 🔥 AUTHENTICATED
    if (authStatus === 'AUTHENTICATED') {
      if (inAuthGroup || inVerifyGroup) {
        router.replace('/(public)');
      }

      return;
    }
  }, [authStatus, verificationToken, isHydrated, segments]);
};
