import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const setItem = async (key: string, value: string) => {
  if (isWeb) {
    localStorage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
};

const getItem = async (key: string) => {
  if (isWeb) {
    return localStorage.getItem(key);
  }

  return await SecureStore.getItemAsync(key);
};

const deleteItem = async (key: string) => {
  if (isWeb) {
    localStorage.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
};

export const saveAccessToken = async (token: string) => {
  await setItem('accessToken', token);
};

export const saveRefreshToken = async (token: string) => {
  await setItem('refreshToken', token);
};

export const saveVerificationToken = async (token: string) => {
  await setItem('verificationToken', token);
};

export const getAccessToken = async () => {
  return await getItem('accessToken');
};

export const getRefreshToken = async () => {
  return await getItem('refreshToken');
};

export const getVerificationToken = async () => {
  return await getItem('verificationToken');
};

export const saveVerificationEmail = async (email: string) => {
  await setItem('verificationEmail', email);
};

export const getVerificationEmail = async () => {
  return await getItem('verificationEmail');
};

export const saveVerificationPhone = async (phone: string) => {
  await setItem('verificationPhone', phone);
};

export const getVerificationPhone = async () => {
  return await getItem('verificationPhone');
};

export const clearVerificationData = async () => {
  await deleteItem('verificationToken');
  await deleteItem('verificationEmail');
  await deleteItem('verificationPhone');
};

export const clearTokens = async () => {
  await deleteItem('accessToken');
  await deleteItem('refreshToken');
  await deleteItem('verificationToken');
  await deleteItem('verificationEmail');
  await deleteItem('verificationPhone');
};
