import { useAuthStore } from '@/store/auth-store';
import { router, useSegments } from 'expo-router';
import { useEffect } from 'react';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const segments = useSegments();

  const authStatus = useAuthStore((s) => s.authStatus);
  const verificationToken = useAuthStore((s) => s.verificationToken);
  const onboardingStatus = useAuthStore((s) => s.onboardingStatus);
  const onboardingStep = useAuthStore((s) => s.onboardingStep);

  useEffect(() => {
    if (!authStatus) return;

    const isPublic = segments.includes('(public)' as never);
    const isAuth = segments.includes('(auth)' as never);
    const isVerify = segments.includes('(verify)' as never);
    const isProtected = segments.includes('(protected)' as never);

    // 🔐 AUTHENTICATED
    if (authStatus === 'AUTHENTICATED') {
      if (!isProtected) {
        if (onboardingStatus !== 'COMPLETED') {
          const completedStep = Number(onboardingStep ?? 0);
          router.replace(
            `/(app)/(protected)/onboarding?step=${completedStep + 1}&resumeStep=${completedStep}`,
          );
        } else {
          router.replace('/(app)/(protected)/(tabs)/home');
        }
      }
      return;
    }

    // 🟡 VERIFYING
    if (authStatus === 'VERIFYING') {
      if (!verificationToken) {
        router.replace('/(app)/(auth)/login');
        return;
      }

      if (!isVerify) {
        router.replace('/(app)/(verify)/phone');
      }
      return;
    }

    // 🔓 UNAUTHENTICATED
    if (authStatus === 'UNAUTHENTICATED') {
      // ✅ ALLOW BOTH PUBLIC + AUTH SCREENS
      if (!isPublic && !isAuth) {
        router.replace('/(public)');
      }
    }
  }, [
    authStatus,
    segments,
    verificationToken,
    onboardingStatus,
    onboardingStep,
  ]);

  return <>{children}</>;
}
