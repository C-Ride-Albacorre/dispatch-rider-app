export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  verificationToken: string;

  user: {
    id: string;
    email: string;
    phoneNumber: string;
    status: string;
    role: string;
  };
}
