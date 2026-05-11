import { api } from '@/libs/api';
import { VerifyEmailPayload, VerifyPhonePayload } from './types';

export const verifyPhone = async (payload: VerifyPhonePayload) => {
  const response = await api.post('/auth/user/verify/phone', payload);

  return response.data.data;
};

export const verifyEmail = async (payload: VerifyEmailPayload) => {
  const response = await api.post('/auth/user/verify/email', payload);

  return response.data.data;
};
