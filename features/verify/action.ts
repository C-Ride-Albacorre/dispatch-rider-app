import Toast from 'react-native-toast-message';
import { resendOtp, verifyEmail, verifyPhone } from './service';
import { VerifyEmailPayload, VerifyPhonePayload } from './types';
import { saveAccessToken, saveRefreshToken } from '@/utils/token-storage';
import { useAuthStore } from '@/store/auth-store';

export const verifyPhoneAction = async (payload: VerifyPhonePayload) => {
  try {
    const data = await verifyPhone(payload);

    console.log(' Verify phone response:', data);

    Toast.show({
      type: 'success',
      text1: 'Phone Verified',
      text2: data.message,
    });

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Verification failed',
    };
  }
};

export const verifyEmailAction = async (payload: VerifyEmailPayload) => {
  try {
    const data = await verifyEmail(payload);

    console.log(' Verify email response:', data);

    await saveAccessToken(data.accessToken);

    await saveRefreshToken(data.refreshToken);

    useAuthStore.getState().setAuth({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      authStatus: 'AUTHENTICATED',
    });

    Toast.show({
      type: 'success',
      text1: 'Email Verified',
      text2: data.message,
    });

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Verification failed',
    };
  }
};

export const resendOtpAction = async (identifier: string) => {
  try {
    const data = await resendOtp(identifier);

    console.log(' Resend OTP response:', data);

    if (!data.success) {
      Toast.show({
        type: 'error',
        text1: 'Failed to resend OTP',
        text2: data.message || 'Please try again later',
      });

      return {
        success: false,
      };
    }

    Toast.show({
      type: 'success',
      text1: 'OTP Resent',
      text2: data.message,
    });

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'OTP resend failed',
    };
  }
};
