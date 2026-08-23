import { clearVerificationData } from "./token-storage";
import { useAuthStore } from "@/store/auth-store";

export const clearVerificationAuth = async () => {
  await clearVerificationData();

  useAuthStore.getState().setAuth({
    verificationToken: null,
    verificationEmail: null,
    verificationPhone: null,

    isEmailVerified: false,
    isPhoneVerified: false,

    authStatus: 'UNAUTHENTICATED',
  });
};