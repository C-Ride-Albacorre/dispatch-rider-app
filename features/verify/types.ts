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
