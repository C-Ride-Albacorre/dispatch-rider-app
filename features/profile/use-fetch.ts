import { useMutation } from '@tanstack/react-query';

import { unregisterDeviceToken } from '@/services/notifications/unregisterDeviceToken';
import { useAuthStore } from '@/store/auth-store';

import { deleteAccountService } from './service';

export function useDeleteAccount() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      try {
        await unregisterDeviceToken();
      } catch {}

      return deleteAccountService({ reason });
    },

    onSuccess: async () => {
      await logout({ skipRemote: true });
    },
  });
}
