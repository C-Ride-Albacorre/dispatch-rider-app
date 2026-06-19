import Toast from 'react-native-toast-message';
import { resendOtp, verifyEmail, verifyPhone } from './service';
import { VerifyEmailPayload, VerifyPhonePayload } from './types';
import { saveAccessToken, saveDriverId, saveRefreshToken } from '@/utils/token-storage';
import { useAuthStore } from '@/store/auth-store';

export const verifyPhoneAction = async (payload: VerifyPhonePayload) => {
  console.log('Verify phone payload:', payload);

  try {
    const data = await verifyPhone(payload);

    console.log('Verify phone response:', data);

    if (data?.status === 'error' || data?.statusCode >= 400) {
      return {
        success: false,
        expired: data?.message?.toLowerCase().includes('expired') || false,
        invalid: data?.message?.toLowerCase().includes('invalid') || false,
        message: data?.message || 'Verification failed',
      };
    }

    // HANDLE FAILED SUCCESS RESPONSE
    if (!data.success) {
      return {
        success: false,
        message: data.message || 'Verification failed',
      };
    }

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

    console.log('Verify email response:', data);

    // HANDLE API ERROR RESPONSE
    if (data?.status === 'error' || data?.statusCode >= 400) {
      return {
        success: false,
        expired: data?.message?.toLowerCase().includes('expired') || false,
        invalid: data?.message?.toLowerCase().includes('invalid') || false,
        message: data?.message || 'Verification failed',
      };
    }

    // HANDLE FAILED SUCCESS RESPONSE
    if (!data.success) {
      return {
        success: false,
        message: data.message || 'Verification failed',
      };
    }

    await saveAccessToken(data.accessToken);

    await saveRefreshToken(data.refreshToken);

    await saveDriverId(data.user.id);

    useAuthStore.getState().setAuth({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      driverId: data.user.id,
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
    const message = error?.response?.data?.message || 'Verification failed';

    return {
      success: false,
      expired: message.toLowerCase().includes('expired'),
      invalid: message.toLowerCase().includes('invalid'),
      message,
    };
  }
};

export const resendOtpAction = async (identifier: string) => {
  try {
    const data = await resendOtp(identifier);

    console.log('Resend OTP response:', data);

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
