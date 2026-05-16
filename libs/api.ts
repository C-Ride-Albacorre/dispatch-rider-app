import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

import Toast from 'react-native-toast-message';

import { BASE_URL } from '@/config/base-api';

import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  clearTokens,
} from '@/utils/token-storage';

import { useAuthStore } from '@/store/auth-store';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

/**
 * ENDPOINTS THAT SHOULD NEVER TRIGGER REFRESH
 *
 * Why?
 * These endpoints can legitimately return 401
 * for invalid OTP / expired code.
 *
 * We do NOT want:
 * 401 -> refresh -> logout
 */
const AUTH_EXCLUDED_ENDPOINTS = [
  '/auth/user/verify/email',
  '/auth/user/verify/phone',
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
];

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();

    /**
     * Only attach access token if it exists
     */
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

    /**
     * If no request exists
     */
    if (!originalRequest) {
      return Promise.reject(error);
    }

    /**
     * Prevent refresh logic for excluded auth routes
     */
    const requestUrl = originalRequest.url || '';

    const isExcluded = AUTH_EXCLUDED_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint),
    );

    /**
     * IMPORTANT:
     * Verification endpoints can return 401
     * for invalid OTP codes.
     *
     * We should NOT refresh/logout.
     */
    if (isExcluded) {
      return Promise.reject(error);
    }

    /**
     * ONLY refresh on protected route 401
     */
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();

        /**
         * No refresh token
         */
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        /**
         * Refresh access token
         */
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;

        /**
         * Save new access token
         */
        await saveAccessToken(accessToken);

        /**
         * Update Zustand store
         */
        useAuthStore.getState().setAuth({
          accessToken,
        });

        /**
         * Retry original request
         */
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        return api(originalRequest);
      } catch (refreshError: any) {
        console.error('Refresh token failed:', refreshError);

        /**
         * Session fully expired
         */
        await clearTokens();

        /**
         * IMPORTANT:
         * logout() already clears state/tokens
         * and resets auth state
         */
        await useAuthStore.getState().logout();

        Toast.show({
          type: 'error',
          text1: 'Session Expired',
          text2: 'Please login again',
        });

        return Promise.reject(refreshError);
      }
    }

    /**
     * Generic error toast
     */
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
