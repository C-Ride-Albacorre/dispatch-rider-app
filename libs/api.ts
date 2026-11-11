import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

import Toast from 'react-native-toast-message';

import { router } from 'expo-router';

import { BASE_URL } from '@/config/base-api';

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from '@/utils/token-storage';

import { useAuthStore } from '@/store/auth-store';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

/**
 * ENDPOINTS THAT SHOULD NEVER TRIGGER REFRESH
 */
const AUTH_EXCLUDED_ENDPOINTS = [
  '/auth/user/verify/email',
  '/auth/user/verify/phone',
  '/auth/driver/login',
  '/auth/driver/register',
  '/auth/forgot-password',
  '/auth/verify-otp',
  '/auth/reset-password',
  '/auth/refresh',
  '/auth/logout',
  '/notification/device/unregister-token',
];

/**
 * ENDPOINTS THAT SHOULD NOT SHOW ERROR TOAST
 */
const SILENT_ERROR_ENDPOINTS = ['/driver/tracking', '/driver/history'];

export const api = axios.create({
  baseURL: BASE_URL,
});

/**
 * REQUEST INTERCEPTOR
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

/**
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = (originalRequest.url || '').split('?')[0];

    const isExcluded = AUTH_EXCLUDED_ENDPOINTS.includes(requestUrl);

    if (isExcluded) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          return Promise.reject(error);
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        await saveAccessToken(accessToken);
        await saveRefreshToken(newRefreshToken);

        useAuthStore.getState().setAuth({
          accessToken,
          refreshToken: newRefreshToken,
        });

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        return api(originalRequest);
      } catch (refreshError: any) {
        await clearTokens();
        await useAuthStore.getState().logout();

        Toast.show({
          type: 'error',
          text1: 'Session Expired',
          text2: 'Please login again',
        });

        router.replace('/(app)/(auth)/login');

        return Promise.reject(refreshError);
      }
    }

    /**
     * Generic error toast
     */
    const message =
      error?.response?.data?.message || error.message || 'Something went wrong';

    const shouldSilenceError = SILENT_ERROR_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint),
    );

    if (!shouldSilenceError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }

    return Promise.reject(error);
  },
);
