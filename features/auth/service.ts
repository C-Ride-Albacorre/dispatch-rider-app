import { api } from '@/libs/api';
import { LoginPayload, RegisterPayload } from './types';
import { ForgetPasswordPayload } from './schema';

export const registerDriver = async (payload: RegisterPayload) => {
  const response = await api.post('/auth/driver/register', payload);

  return response.data;
};

export const loginDriver = async (payload: LoginPayload) => {
  const response = await api.post('/auth/driver/login', payload);

  return response.data;
};

export const forgotPassword = async (payload: ForgetPasswordPayload) => {
  const response = await api.post('/auth/forgot-password', payload);

  return response.data;
};
