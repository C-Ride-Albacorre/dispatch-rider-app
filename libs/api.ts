import axios, { AxiosRequestConfig } from 'axios';

import { BASE_URL } from '@/config/base-api';

import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  clearTokens,
} from '@/utils/token-storage';

import { useAuthStore } from '@/store/auth-store';

import Toast from 'react-native-toast-message';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();

        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;

        await saveAccessToken(accessToken);

        useAuthStore.getState().setAuth({
          accessToken,
        });

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        return api(originalRequest);
      } catch (refreshError) {
        await clearTokens();

        await useAuthStore.getState().logout();

        Toast.show({
          type: 'error',
          text1: 'Session Expired',
          text2: 'Please login again',
        });

        return Promise.reject(refreshError);
      }
    }

    const message =
      error?.response?.data?.message || error.message || 'Something went wrong';

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
    });

    return Promise.reject(error);
  },
);
