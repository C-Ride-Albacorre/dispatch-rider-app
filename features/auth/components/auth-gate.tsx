import { ReactNode, useEffect } from 'react';

import { restoreAuth, useAuthStore } from '@/store/auth-store';

import { useProtectedRoute } from '@/hooks/use-protected-routes';

type Props = {
  children: ReactNode;
};

export function AuthGate({ children }: Props) {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    restoreAuth();
  }, []);

  useProtectedRoute();

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}
