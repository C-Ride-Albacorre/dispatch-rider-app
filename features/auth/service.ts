import { api } from '@/libs/api';
import { LoginPayload, RegisterPayload } from './types';

export const registerDriver = async (payload: RegisterPayload) => {
  const response = await api.post('/auth/driver/register', payload);

  return response.data;
};

export const loginDriver = async (payload: LoginPayload) => {
  const response = await api.post('/auth/driver/login', payload);

  return response.data;
};
