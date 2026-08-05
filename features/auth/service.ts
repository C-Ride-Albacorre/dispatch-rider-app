import { api } from '@/libs/api';
import { LoginPayload, RegisterPayload, ResetPasswordRequest } from './types';

interface ForgotPasswordRequest {
  identifier: string;
  client: string;
}

export interface VerifyResetRequest {
  identifier: string;
  otp: string;
}

export const registerDriver = async (payload: RegisterPayload) => {
  const response = await api.post('/auth/driver/register', payload);

  return response.data;
};

export const loginDriver = async (payload: LoginPayload) => {
  const response = await api.post('/auth/driver/login', payload);

  return response.data;
};

export const forgotPassword = async (payload: ForgotPasswordRequest) => {
  const response = await api.post('/auth/forgot-password', payload);

  return response.data;
};


export const verifyReset = async (payload: VerifyResetRequest) => {
  const response = await api.post('/auth/verify-otp', payload);

  return response.data;
};


export const resetPassword = async (payload: ResetPasswordRequest
) => {
  const response = await api.put('/auth/reset-password', payload);

  return response.data;
};