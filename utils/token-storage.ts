import * as SecureStore from 'expo-secure-store';

export const saveAccessToken = async (token: string) => {
  await SecureStore.setItemAsync('accessToken', token);
};

export const saveRefreshToken = async (token: string) => {
  await SecureStore.setItemAsync('refreshToken', token);
};

export const saveVerificationToken = async (token: string) => {
  await SecureStore.setItemAsync('verificationToken', token);
};

export const getAccessToken = async () => {
  return await SecureStore.getItemAsync('accessToken');
};

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync('refreshToken');
};

export const getVerificationToken = async () => {
  return await SecureStore.getItemAsync('verificationToken');
};

export const saveVerificationEmail = async (email: string) => {
  await SecureStore.setItemAsync('verificationEmail', email);
};

export const getVerificationEmail = async () => {
  return await SecureStore.getItemAsync('verificationEmail');
};

export const saveVerificationPhone = async (phone: string) => {
  await SecureStore.setItemAsync('verificationPhone', phone);
};

export const getVerificationPhone = async () => {
  return await SecureStore.getItemAsync('verificationPhone');
};

export const clearVerificationData = async () => {
  await SecureStore.deleteItemAsync('verificationToken');
  await SecureStore.deleteItemAsync('verificationEmail');
  await SecureStore.deleteItemAsync('verificationPhone');
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync('accessToken');

  await SecureStore.deleteItemAsync('refreshToken');

  await SecureStore.deleteItemAsync('verificationToken');

  await SecureStore.deleteItemAsync('verificationEmail');

  await SecureStore.deleteItemAsync('verificationPhone');
};
