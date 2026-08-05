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

export const saveDriverId = async (driverId: string) => {
  await setItem('driverId', driverId);
};

export const getDriverId = async () => {
  return await getItem('driverId');
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

export const saveVerificationIdentifier = async (identifier: string) => {
  await setItem('verificationIdentifier', identifier);
};

export const getVerificationIdentifier = async () => {
  return await getItem('verificationIdentifier');
};

export const saveVerificationMethod = async (method: string) => {
  await setItem('verificationMethod', method);
};

export const getVerificationMethod = async () => {
  return await getItem('verificationMethod');
};


export const saveResetToken = async (token: string) => {
  await setItem('resetToken', token);
};

export const getResetToken = async () => {
  return await getItem('resetToken');
}

export const clearResetToken = async () => {
  await deleteItem('resetToken');
}

export const saveOnboardingStatus = async (status: string) => {
  await setItem('onboardingStatus', status);
};

export const getOnboardingStatus = async () => {
  return await getItem('onboardingStatus');
};

export const saveOnboardingStep = async (step: number) => {
  await setItem('onboardingStep', String(step));
};

export const saveActiveOrder = async (orderId: string) => {
  await setItem('activeOrder', JSON.stringify({ order_id: orderId }));
};

export const getActiveOrder = async () => {
  const value = await getItem('activeOrder');

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const clearActiveOrder = async () => {
  await deleteItem('activeOrder');
};

export const getOnboardingStep = async () => {
  return await getItem('onboardingStep');
};

export const clearVerificationData = async () => {
  await deleteItem('verificationToken');
  await deleteItem('verificationEmail');
  await deleteItem('verificationPhone');
  await deleteItem('verificationIdentifier');
  await deleteItem('verificationMethod');
  await deleteItem('resetToken');
};

export const saveNotificationPermissionDecision = async (
  decision: 'allowed' | 'denied',
) => {
  await setItem('notification_permission_decision', decision);
};

export const getNotificationPermissionDecision = async (): Promise<
  'allowed' | 'denied' | null
> => {
  return (await getItem('notification_permission_decision')) as
    | 'allowed'
    | 'denied'
    | null;
};

export const clearTokens = async () => {
  await deleteItem('accessToken');
  await deleteItem('refreshToken');

  await deleteItem('onboardingStatus');
  await deleteItem('onboardingStep');

  await deleteItem('verificationToken');
  await deleteItem('verificationEmail');
  await deleteItem('verificationPhone');
  await deleteItem('verificationIdentifier');
  await deleteItem('verificationMethod');
await deleteItem('resetToken');

  await deleteItem('driverId');
  await deleteItem('activeOrder');

  await deleteItem('notification_permission_decision');
};
