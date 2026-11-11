import Toast from 'react-native-toast-message';

import {
  saveAccessToken,
  saveDriverId,
  saveOnboardingStatus,
  saveOnboardingStep,
  saveRefreshToken,
  saveResetToken,
  saveVerificationEmail,
  saveVerificationIdentifier,
  saveVerificationMethod,
  saveVerificationPhone,
  saveVerificationToken,
} from '@/utils/token-storage';

import { useAuthStore } from '@/store/auth-store';
import { ForgetPasswordPayload } from './schema';
import {
  forgotPassword,
  loginDriver,
  registerDriver,
  resetPassword,
  verifyReset,
  VerifyResetRequest,
} from './service';
import { LoginPayload, RegisterPayload, ResetPasswordRequest } from './types';

export const registerAction = async (payload: RegisterPayload) => {
  const parsedPayload = {
    ...payload,

    email: payload.email.toLowerCase().trim(),
    phoneNumber: payload.phoneNumber.trim(),
  };

  try {
    const result = await registerDriver(parsedPayload);

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
  const parsedPayload = {
    ...payload,
    email: payload.email.toLowerCase().trim(),
  };

  try {
    const result = await loginDriver(parsedPayload);

    /**
     * =========================
     * UNVERIFIED
     * =========================
     */
    if (result.data.status === 'UNVERIFIED') {
      const {
        verificationToken,
        identifier,
        email,
        phoneNumber,
        isEmailVerified,
        isPhoneVerified,
        message,
      } = result.data;

      if (isPhoneVerified && !isEmailVerified) {
        return {
          success: true as const,
          flow: 'verification' as const,
          verificationMethod: 'email' as const,

          verificationToken,
          verificationEmail: identifier,

          isEmailVerified,
          isPhoneVerified,

          message:
            message || 'Please verify your email address',
        };
      }

      return {
        success: true as const,
        flow: 'verification' as const,
        verificationMethod: 'phone' as const,

        verificationToken,
        verificationEmail: email,
        verificationPhone: phoneNumber,


        isEmailVerified,
        isPhoneVerified,

        message: message || 'Verification required',
      };
    }

    /**
     * =========================
     * LOGIN FAILED
     * =========================
     */
    if (result.data.status === 'error') {
      return {
        success: false as const,
        flow: 'error' as const,
        message: result.data.message || 'Login failed',
      };
    }

    /**
     * =========================
     * AUTHENTICATED
     * =========================
     */
    return {
      success: true as const,
      flow: 'authenticated' as const,

      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,

      onboardingStatus: result.data.onboardingStatus,
      onboardingStep: result.data.onboardingStep,

      driverId: result.data.user.id,

      status: result.data.status,

      message: result.data.message || 'Login successful',
    };
  } catch (error: any) {
    return {
      success: false as const,
      flow: 'error' as const,
      message:
        error?.response?.data?.message || 'Login failed',
    };
  }
};



export const forgetPasswordAction = async (payload: ForgetPasswordPayload) => {
  try {
    const parsedPayload = {
      identifier: (payload.email || payload.phoneNumber) as string,
      client: 'mobile',
    };
    const result = await forgotPassword(parsedPayload);

    if (!result.data.identifier || !result.data.method) {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: 'Account with this identifier does not exist.',
      });

      return {
        success: false,
        message:
          'Verification failed. Account with this identifier does not exist.',
      };
    }

    if (result.data.identifier && result.data.method) {
      await saveVerificationIdentifier(result.data.identifier);

      await saveVerificationMethod(result.data.method);
    }

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

export const VerifyResetAction = async (payload: VerifyResetRequest) => {
  try {
    const data = await verifyReset(payload);

    if (data?.status === 'error' || data?.statusCode >= 400) {
      return {
        success: false,
        expired: data?.message?.toLowerCase().includes('expired') || false,
        invalid: data?.message?.toLowerCase().includes('invalid') || false,
        message: data?.message || 'Verification failed',
      };
    }

    // HANDLE FAILED SUCCESS RESPONSE
    if (!data.data.success) {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: data.data.message || 'Verification failed',
      });

      return {
        success: false,
        message: data.data.message || 'Verification failed',
      };
    }

    await saveResetToken(data.data.resetToken);

    Toast.show({
      type: 'success',
      text1: 'Verification Successful',
      text2: data.data.message,
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

export const ResetPasswordAction = async (payload: ResetPasswordRequest) => {
  try {
    const data = await resetPassword(payload);

    if (data.status === 'error' || data.statusCode >= 400) {
      return {
        success: false,
        message: data.message || 'Password reset failed',
      };
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Password reset successfully',
    });

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message ?? 'Password reset failed',
    };
  }
};
