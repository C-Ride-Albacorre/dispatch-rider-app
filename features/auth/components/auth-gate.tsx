import { useEffect } from 'react';
import { router, usePathname } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const authStatus = useAuthStore((s) => s.authStatus);
  const verificationToken = useAuthStore((s) => s.verificationToken);

  useEffect(() => {
    if (!authStatus) return;

    const isPublic = pathname.startsWith('/(public)');
    const isAuth = pathname.startsWith('/(app)/(auth)'); // ✅ ADD THIS
    const isVerify = pathname.startsWith('/(app)/(verify)');
    const isProtected = pathname.startsWith('/(app)/(protected)');

    // 🔐 AUTHENTICATED
    if (authStatus === 'AUTHENTICATED') {
      if (!isProtected) {
        router.replace('/(app)/(protected)/dashboard');
      }
      return;
    }

    // 🟡 VERIFYING
    if (authStatus === 'VERIFYING') {
      if (!verificationToken) {
        router.replace('/(app)/(auth)/login'); // fallback safe route
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
  }, [authStatus, pathname, verificationToken]);

  return <>{children}</>;
}
