import { useAuthStore } from '@/store/auth-store';
import {
  saveAccessToken,
  saveRefreshToken,
  saveOnboardingStatus,
  saveOnboardingStep,
  saveDriverId,
} from './token-storage';


export const saveAuthenticatedAuth = async (data: {
  accessToken: string;
  refreshToken: string;
  onboardingStatus: string;
  onboardingStep: number;
  driverId: string;
}) => {
  await saveAccessToken(data.accessToken);
  await saveRefreshToken(data.refreshToken);

  await saveOnboardingStatus(data.onboardingStatus);
  await saveOnboardingStep(data.onboardingStep);
  await saveDriverId(data.driverId);

  useAuthStore.getState().setAuth({
    accessToken: data.accessToken,

    refreshToken: data.refreshToken,

    onboardingStatus: data.onboardingStatus,

    onboardingStep: data.onboardingStep,

    driverId: data.driverId,

    authStatus: 'AUTHENTICATED',
  });
};
