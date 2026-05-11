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
    const data = await registerDriver(payload);

    console.log('Register response:', data);

    await saveVerificationToken(data.verificationToken);

    await saveVerificationEmail(data.user.email);

    await saveVerificationPhone(data.user.phoneNumber);

    useAuthStore.getState().setAuth({
      verificationToken: data.verificationToken,
      verificationEmail: data.user.email,
      verificationPhone: data.user.phoneNumber,
      authStatus: 'VERIFYING',
    });

    Toast.show({
      type: 'success',
      text1: 'Registration Successful',
      text2: data.message,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};

export const loginAction = async (payload: LoginPayload) => {
  try {
    const data = await loginDriver(payload);

    // 🔥 UNVERIFIED FLOW
    if (!data.success && data.status === 'UNVERIFIED') {
      await saveVerificationToken(data.verificationToken);

      useAuthStore.getState().setAuth({
        verificationToken: data.verificationToken,
      });

      return {
        success: false,
        unverified: true,
      };
    }

    // 🔥 VERIFIED FLOW
    await saveAccessToken(data.accessToken);

    await saveRefreshToken(data.refreshToken);

    useAuthStore.getState().setAuth({
      accessToken: data.accessToken,

      refreshToken: data.refreshToken,
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
