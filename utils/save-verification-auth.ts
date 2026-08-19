import { useAuthStore } from '@/store/auth-store';
import {
  saveVerificationToken,
  saveVerificationEmail,
  saveVerificationPhone,
} from './token-storage';

export const saveVerificationAuth = async (data: {

  verificationToken: string;
  verificationEmail?: string;
  verificationPhone?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}) => {
  await saveVerificationToken(data.verificationToken);

  if (data.verificationEmail) {
    await saveVerificationEmail(data.verificationEmail);
  }



  if (data.verificationPhone) {
    await saveVerificationPhone(data.verificationPhone);
  }

  useAuthStore.getState().setAuth({
    verificationToken: data.verificationToken,

    verificationEmail: data.verificationEmail,

    verificationPhone: data.verificationPhone,

    isEmailVerified: data.isEmailVerified,

    isPhoneVerified: data.isPhoneVerified,

    authStatus: 'VERIFYING',
  });
};
