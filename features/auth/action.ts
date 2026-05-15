import Toast from 'react-native-toast-message';

import {
  saveAccessToken,
  saveRefreshToken,
  saveVerificationEmail,
  saveVerificationPhone,
  saveVerificationToken,
} from '@/utils/token-storage';

import { useAuthStore } from '@/store/auth-store';
import { loginDriver, registerDriver } from './service';
import { LoginPayload, RegisterPayload } from './types';

export const registerAction = async (payload: RegisterPayload) => {
  try {
    const result = await registerDriver(payload);

    console.log('Register response:', result);

    await saveVerificationToken(result.data.verificationToken);

    await saveVerificationEmail(result.data.user.email);

    await saveVerificationPhone(result.data.user.phoneNumber);

    useAuthStore.getState().setAuth({
      verificationToken: result.data.verificationToken,
      verificationEmail: result.data.user.email,
      verificationPhone: result.data.user.phoneNumber,
      authStatus: 'VERIFYING',
    });

    Toast.show({
      type: 'success',
      text1: 'Registration Successful',
      text2: result.data.message,
    });

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Registration failed',
    };
  }
};

export const loginAction = async (payload: LoginPayload) => {
  try {
    const result = await loginDriver(payload);

    console.log(' Login response:', result);

    if (!result.success && result.status === 'UNVERIFIED') {
      await saveVerificationToken(result.verificationToken);

      useAuthStore.getState().setAuth({
        verificationToken: result.data.verificationToken,
      });

      return {
        success: false,
        unverified: true,
      };
    }

    // 🔥 VERIFIED FLOW
    await saveAccessToken(result.data.accessToken);

    await saveRefreshToken(result.data.refreshToken);

    useAuthStore.getState().setAuth({
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      authStatus: 'AUTHENTICATED',
    });

    Toast.show({
      type: 'success',
      text1: 'Login Successful',
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};
