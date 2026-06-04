import Toast from 'react-native-toast-message';

import {
  saveAccessToken,
  saveOnboardingStatus,
  saveOnboardingStep,
  saveRefreshToken,
  saveVerificationEmail,
  saveVerificationPhone,
  saveVerificationToken,
} from '@/utils/token-storage';

import { useAuthStore } from '@/store/auth-store';
import { ForgetPasswordPayload } from './schema';
import { forgotPassword, loginDriver, registerDriver } from './service';
import { LoginPayload, RegisterPayload } from './types';
import { BASE_URL } from '@/config/base-api';

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
  const res = await fetch('https://google.com');

  console.log('Internet works:', res.status);
} catch (e) {
  console.log('Internet failed:', e);
}


try {
  const res = await fetch(`${BASE_URL}/health`);
  console.log('Backend works:', res.status);
} catch (e) {
  console.log('Backend failed:', e);
}



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

          isEmailVerified: result.data.isEmailVerified,
          isPhoneVerified: result.data.isPhoneVerified,
          authStatus: 'VERIFYING',
        });
      } else {
        await saveVerificationEmail(result.data.email);

        await saveVerificationPhone(result.data.phoneNumber);

        useAuthStore.getState().setAuth({
          verificationToken: result.data.verificationToken,
          verificationEmail: result.data.email,
          verificationPhone: result.data.phoneNumber,

          isEmailVerified: result.data.isEmailVerified,
          isPhoneVerified: result.data.isPhoneVerified,

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

      await saveOnboardingStatus(result.data.onboardingStatus);

      await saveOnboardingStep(result.data.onboardingStep);

      useAuthStore.getState().setAuth({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,

        onboardingStatus: result.data.onboardingStatus,

        onboardingStep: result.data.onboardingStep,

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
    console.log('FULL ERROR');
    console.log(JSON.stringify(error, null, 2));

    console.log('response', error?.response);
    console.log('data', error?.response?.data);
    console.log('message', error?.message);
    console.log('code', error?.code);
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
