import { useMutation } from '@tanstack/react-query';

import { unregisterDeviceToken } from '@/services/notifications/unregisterDeviceToken';
import { useAuthStore } from '@/store/auth-store';

import { deleteAccountService } from './service';

export function useDeleteAccount() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      // Unregister push token while the account still exists,
      // otherwise the request would 401 after deletion.
      try {
        await unregisterDeviceToken();
      } catch (error) {
        console.log('Failed to unregister device token:', error);
      }

      return deleteAccountService({ reason });
    },

    onSuccess: async () => {
      // Account no longer exists — only clear the local session
      await logout({ skipRemote: true });
    },
  });
}
