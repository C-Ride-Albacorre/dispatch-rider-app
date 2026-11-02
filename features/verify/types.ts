export type VerifyPhonePayload = {
  phoneNumber: string;
  otp: string;
  verificationToken: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
  verificationToken: string;
};

export type ResendVerificationTokenResponse = {
  message: string;
  verificationToken: string;
  verificationIdentifier: string;
  requiresVerification: boolean;
  otpExpiresAt: string;
};
