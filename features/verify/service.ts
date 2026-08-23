import { api } from '@/libs/api';
import { VerifyEmailPayload, VerifyPhonePayload } from './types';

export const verifyPhone = async (payload: VerifyPhonePayload) => {
  const response = await api.post('/auth/user/verify/phone', payload);

    console.log(' Verify phone response:', response.data.data);

  return response.data.data;


};

export const verifyEmail = async (payload: VerifyEmailPayload) => {
  const response = await api.post('/auth/user/verify/email', payload);

  return response.data.data;
};

export const resendOtp = async (identifier: string) => {
  const response = await api.post('/auth/resend-otp', { identifier });

  return response.data.data;
};
