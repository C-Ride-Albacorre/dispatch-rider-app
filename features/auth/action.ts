import Toast from 'react-native-toast-message';

import {
  saveAccessToken,
  saveRefreshToken,
  saveVerificationEmail,
  saveVerificationPhone,
  saveVerificationToken,
} from '@/utils/token-storage';

import { useAuthStore } from '@/store/auth-store';
import { forgotPassword, loginDriver, registerDriver } from './service';
import { LoginPayload, RegisterPayload } from './types';
import { ForgetPasswordPayload } from './schema';

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

    console.log('Login response:', result);

    /**
     * =========================
     * UNVERIFIED FLOW
     * =========================
     */

    if (result.data.status === 'UNVERIFIED') {
      await saveVerificationToken(result.data.verificationToken);

      if (result.data.isPhoneVerified && !result.data.isEmailVerified) {
        await saveVerificationEmail(result.data.identifier);

        useAuthStore.getState().setAuth({
          verificationToken: result.data.verificationToken,
          verificationEmail: result.data.identifier,
          authStatus: 'VERIFYING',
        });
      } else {
        await saveVerificationEmail(result.data.email);

        await saveVerificationPhone(result.data.phoneNumber);

        useAuthStore.getState().setAuth({
          verificationToken: result.data.verificationToken,
          verificationEmail: result.data.email,
          verificationPhone: result.data.phoneNumber,
          authStatus: 'VERIFYING',
        });
      }

      return {
        success: true,
        unverified: true,
        status: result.data.status,
        isPhoneVerified: result.data.isPhoneVerified,
        isEmailVerified: result.data.isEmailVerified,

        message: result.data.message || 'Account verification required',
      };
    }

    /**
     * =========================
     * LOGIN FAILED
     * =========================
     */
    if (result.data.status === 'error') {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: result.data.message,
      });

      return {
        success: false,
        message: result.data.message || 'Login failed',
      };
    } else {
      /**
       * =========================
       * VERIFIED FLOW
       * =========================
       */
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
        status: result.data.status,
        onboardingStatus: result.data.onboardingStatus,
        onboardingStep: result.data.onboardingStep,
        message: result.data.message || 'Login successful',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Login failed',
    };
  }
};

export const forgetPasswordAction = async (payload: ForgetPasswordPayload) => {
  try {
    const result = await forgotPassword(payload);

    console.log('Forgot password response:', result);

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: result.data.message,
    });

    return {
      success: true,
      identifier: result.data.identifier,
      method: result.data.method,
      message: result.data.message,
    };
  } catch (error: any) {
    Toast.show({
      type: 'error',
      text1: 'Request Failed',
      text2: error?.response?.data?.message || 'Something went wrong',
    });

    return {
      success: false,
      message: error?.response?.data?.message || 'Forgot password failed',
    };
  }
};
