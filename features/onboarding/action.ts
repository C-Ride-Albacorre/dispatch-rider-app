import { useAuthStore } from '@/store/auth-store';
import { normalizeOnboardingStatus } from '@/utils/onboarding-status';
import {
  saveOnboardingStatus,
  saveOnboardingStep,
} from '@/utils/token-storage';
import Toast from 'react-native-toast-message';
import { PersonalInfoFormValues, Step3Payload } from './schema';
import { onboarding, submitDriverDocuments } from './service';

export type VehicleInfoPayload = {
  vehicleType: 'CAR' | 'EV';
  vehicleMake: string;
  vehicleModel: string;
  year: number;
  licensePlate: string;
  notes?: string;
};

export async function personalInfoAction(payload: PersonalInfoFormValues) {
  try {
    const result = await onboarding(payload, 1);

    console.log('Result from action:', result);

    const responseData = result?.data;

    console.log('Response data from action:', responseData);

    if (!responseData?.success) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: responseData?.message ?? 'Failed to save personal information',
      });

      return {
        success: false,
        message: responseData?.message ?? 'Failed to save personal information',
      };
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: responseData?.message ?? 'Personal information saved successfully',
    });

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'An unexpected error occurred',
    });

    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}
export async function vehicleInfoAction(payload: VehicleInfoPayload) {
  try {
    console.log(' Calling onboarding service with payload:', payload);
    const result = await onboarding(payload, 2);

    const responseData = result?.data;

    console.log('Result from action:', responseData);

    if (!responseData?.success) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: responseData?.message || 'Failed to save vehicle information',
      });

      return {
        success: false,
        message: responseData?.message || 'Failed to save vehicle information',
      };
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: responseData?.message || 'Vehicle information saved successfully',
    });

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'An unexpected error occurred',
    });

    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function submitDocumentsAction(payload: Step3Payload) {
  console.log('Submitting documents with payload:', payload);

  try {
    const response = await submitDriverDocuments(payload);

    console.log('Raw API response:', response);

    const data = response?.data;

    if (!data?.success) {
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: data?.message ?? 'Failed to upload documents',
      });

      return {
        success: false,
        message: data?.message ?? 'Failed to upload documents',
      };
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: data?.message ?? 'Documents uploaded successfully',
    });

    const latestStatus =
      normalizeOnboardingStatus(data?.onboardingStatus) ?? 'SUBMITTED';

    await saveOnboardingStatus(latestStatus);
    await saveOnboardingStep(3);

    useAuthStore.getState().setAuth({
      onboardingStatus: latestStatus,
      onboardingStep: 3,
    });

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.log('UPLOAD ERROR:', error?.response?.data || error);

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2:
        error?.response?.data?.message ||
        'An unexpected error occurred while uploading documents',
    });

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        'An unexpected error occurred while uploading documents',
    };
  }
}
