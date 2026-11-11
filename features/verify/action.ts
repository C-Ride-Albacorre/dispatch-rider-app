import { useAuthStore } from '@/store/auth-store';
import {
  saveAccessToken,
  saveDriverId,
  saveRefreshToken,
  saveVerificationToken,
} from '@/utils/token-storage';
import Toast from 'react-native-toast-message';
import {
  resendOtp,
  resendVerificationToken,
  verifyEmail,
  verifyPhone,
} from './service';
import {
  ResendVerificationTokenResponse,
  VerifyEmailPayload,
  VerifyPhonePayload,
} from './types';

export const verifyPhoneAction = async (
  payload: VerifyPhonePayload,
) => {
  try {
    const data = await verifyPhone(payload);

    const message = data?.message || 'Verification failed';
    const normalizedMessage = message.toLowerCase();

    /**
     * ==========================================
     * API ERROR
     * ==========================================
     */
    if (data?.status === 'error' || data?.statusCode >= 400) {
      /**
       * TOKEN ERROR
       */
      const tokenError =
        normalizedMessage.includes('verification token') ||
        normalizedMessage.includes('token expired') ||
        normalizedMessage.includes('invalid token');

      /**
       * CODE ERROR
       */
      const codeError =
        normalizedMessage.includes('verification code') ||
        normalizedMessage.includes('verification otp') ||
        normalizedMessage.includes('otp');

      /**
       * TOKEN HAS EXPIRED/IS INVALID
       */
      if (tokenError && !codeError) {
        return refreshExpiredVerificationToken(payload.phoneNumber, message);
      }

      /**
       * OTP/CODE IS INVALID OR EXPIRED
       */
      if (codeError) {
        return {
          success: false as const,
          tokenExpired: false as const,
          codeInvalid: true as const,
          message,
        };
      }

      /**
       * Unknown authentication error.
       */
      return {
        success: false as const,
        tokenExpired: false as const,
        codeInvalid: false as const,
        message,
      };
    }

    /**
     * ==========================================
     * FAILED RESPONSE
     * ==========================================
     */
    if (!data?.success) {
      return {
        success: false as const,
        tokenExpired: false as const,
        codeInvalid: false as const,
        message,
      };
    }

    /**
     * ==========================================
     * SUCCESS
     * ==========================================
     */
    useAuthStore.getState().setAuth({
      isPhoneVerified: true,
      authStatus: 'VERIFYING',
    });

    Toast.show({
      type: 'success',
      text1: 'Phone Verified',
      text2: message,
    });

    return {
      success: true as const,
      data,
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      'Verification failed';

    const normalizedMessage = message.toLowerCase();

    const tokenError =
      normalizedMessage.includes('verification token') ||
      normalizedMessage.includes('token expired') ||
      normalizedMessage.includes('invalid token');

    const codeError =
      normalizedMessage.includes('verification code') ||
      normalizedMessage.includes('verification otp') ||
      normalizedMessage.includes('otp');

    /**
     * Actual token failure.
     */
    if (tokenError && !codeError) {
      return refreshExpiredVerificationToken(payload.phoneNumber, message);
    }

    /**
     * OTP/code failure.
     */
    if (codeError) {
      return {
        success: false as const,
        tokenExpired: false as const,
        codeInvalid: true as const,
        message,
      };
    }

    return {
      success: false as const,
      tokenExpired: false as const,
      codeInvalid: false as const,
      message,
    };
  }
};

export const verifyEmailAction = async (
  payload: VerifyEmailPayload,
) => {
  try {
    const data = await verifyEmail(payload);

    const message =
      data?.message || 'Verification failed';

    const normalizedMessage =
      message.toLowerCase();

    /**
     * ==========================================
     * API ERROR
     * ==========================================
     */
    if (
      data?.status === 'error' ||
      data?.statusCode >= 400
    ) {
      const tokenError =
        normalizedMessage.includes('verification token') ||
        normalizedMessage.includes('token expired') ||
        normalizedMessage.includes('invalid token');

      const codeError =
        normalizedMessage.includes('verification code') ||
        normalizedMessage.includes('verification otp') ||
        normalizedMessage.includes('otp');

      /**
       * TOKEN ERROR
       */
      if (tokenError && !codeError) {
        return refreshExpiredVerificationToken(payload.email, message);
      }

      /**
       * OTP/CODE ERROR
       */
      if (codeError) {
        return {
          success: false as const,
          tokenExpired: false as const,
          codeInvalid: true as const,
          message,
        };
      }

      return {
        success: false as const,
        tokenExpired: false as const,
        codeInvalid: false as const,
        message,
      };
    }

    /**
     * ==========================================
     * FAILED RESPONSE
     * ==========================================
     */
    if (!data?.success) {
      return {
        success: false as const,
        tokenExpired: false as const,
        codeInvalid: false as const,
        message,
      };
    }

    /**
     * ==========================================
     * SUCCESS
     * ==========================================
     */
    await saveAccessToken(data.accessToken);
    await saveRefreshToken(data.refreshToken);
    await saveDriverId(data.user.id);

    useAuthStore.getState().setAuth({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      driverId: data.user.id,

      isEmailVerified: true,
      isPhoneVerified: true,

      authStatus: 'AUTHENTICATED',
    });

    Toast.show({
      type: 'success',
      text1: 'Email Verified',
      text2: message,
    });

    return {
      success: true as const,
      data,
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      'Verification failed';

    const normalizedMessage =
      message.toLowerCase();

    const tokenError =
      normalizedMessage.includes('verification token') ||
      normalizedMessage.includes('token expired') ||
      normalizedMessage.includes('invalid token');

    const codeError =
      normalizedMessage.includes('verification code') ||
      normalizedMessage.includes('verification otp') ||
      normalizedMessage.includes('otp');

    if (tokenError && !codeError) {
      return refreshExpiredVerificationToken(payload.email, message);
    }

    if (codeError) {
      return {
        success: false as const,
        tokenExpired: false as const,
        codeInvalid: true as const,
        message,
      };
    }

    return {
      success: false as const,
      tokenExpired: false as const,
      codeInvalid: false as const,
      message,
    };
  }
};
export const resendOtpAction = async (identifier: string) => {
  try {
    const data = await resendOtp(identifier);

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

export const resendVerificationTokenAction = async (identifier: string) => {
  try {
    const data: ResendVerificationTokenResponse =
      await resendVerificationToken(identifier);

    if (!data?.verificationToken) {
      return {
        success: false as const,
        message: data?.message || 'Failed to resend verification code',
      };
    }

    await saveVerificationToken(data.verificationToken);

    useAuthStore.getState().setAuth({
      verificationToken: data.verificationToken,
    });

    return {
      success: true as const,
      message: data.message,
    };
  } catch (error: any) {
    return {
      success: false as const,
      message:
        error?.response?.data?.message ||
        'Failed to resend verification code',
    };
  }
};

const refreshExpiredVerificationToken = async (
  identifier: string,
  message: string,
) => {
  const result = await resendVerificationTokenAction(identifier);

  if (result.success) {
    Toast.show({
      type: 'info',
      text1: 'Code Expired',
      text2: "We've sent you a new verification code",
    });

    return {
      success: false as const,
      tokenExpired: false as const,
      tokenRefreshed: true as const,
      codeInvalid: false as const,
      message: 'Your session expired. Enter the new code we just sent.',
    };
  }

  await useAuthStore.getState().logout();

  return {
    success: false as const,
    tokenExpired: true as const,
    codeInvalid: false as const,
    message,
  };
};

export const validateVerificationStateAction = async () => {
  const authStore = useAuthStore.getState();
  const { verificationToken, isEmailVerified, isPhoneVerified } = authStore;

  // Case 1: No verification info exists
  if (!verificationToken) {
    await authStore.logout();
    Toast.show({
      type: 'error',
      text1: 'Invalid Session',
      text2: 'Please log in again to verify your account',
    });
    return {
      success: false,
      reason: 'no_verification_token',
    };
  }

  // Case 2: Account is already verified
  if (isEmailVerified && isPhoneVerified) {
    await authStore.logout();
    Toast.show({
      type: 'error',
      text1: 'Account Already Verified',
      text2: 'Please log in again',
    });
    return {
      success: false,
      reason: 'already_verified',
    };
  }

  return {
    success: true,
  };
};
