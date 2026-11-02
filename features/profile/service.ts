import { api } from '@/libs/api';

export async function deleteAccountService({ reason }: { reason: string }) {
  if (!reason) {
    throw new Error('A reason is required');
  }

  const response = await api.delete('/user/delete', { data: { reason } });

  return response.data;
}
