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

let refreshing: Promise<string | null> | null = null;

/**
 * Swaps the refresh token for a new access token. Requests that hit 401 at the
 * same moment all wait on the same call, so the refresh token (which the server
 * replaces on every refresh) is only used once. If the refresh fails, the user
 * is logged out once, not once per request.
 * Resolves to null when there is no refresh token to use.
 */
function refreshSession() {
  if (!refreshing) {
    refreshing = (async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return null;

      try {
        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        await saveAccessToken(accessToken);
        await saveRefreshToken(newRefreshToken);
        useAuthStore.getState().setAuth({ accessToken, refreshToken: newRefreshToken });

        return accessToken as string;
      } catch (refreshError) {
        await clearTokens();
        await useAuthStore.getState().logout();

        Toast.show({
          type: 'error',
          text1: 'Session Expired',
          text2: 'Please login again',
        });

        router.replace('/(app)/(auth)/login');

        throw refreshError;
      }
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

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

      const accessToken = await refreshSession();

      if (!accessToken) {
        return Promise.reject(error);
      }

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      return api(originalRequest);
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
