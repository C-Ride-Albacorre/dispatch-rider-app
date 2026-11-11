import { useAuthStore } from '@/store/auth-store';
import { normalizeOnboardingStatus } from '@/utils/onboarding-status';
import {
  saveOnboardingStatus,
  saveOnboardingStep,
} from '@/utils/token-storage';
import Toast from 'react-native-toast-message';
import { PersonalInfoFormValues, Step3Payload } from './schema';
import { onboarding, submitDriverDocuments } from './service';
import { saveOnboardingProgress } from '@/utils/save-onboarding-progress';

export type VehicleInfoPayload = {
  vehicleTypeConfigId: string;
  vehicleMake: string;
  vehicleModel: string;
  year: number;
  licensePlate: string;
  notes?: string;
};

export async function personalInfoAction(
  payload: PersonalInfoFormValues,
) {
  try {
    const result = await onboarding(payload, 1);

    const responseData = result?.data;

    if (!responseData?.success) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          responseData?.message ??
          'Failed to save personal information',
      });

      return {
        success: false,
        message:
          responseData?.message ??
          'Failed to save personal information',
      };
    }

    const onboardingStatus =
      normalizeOnboardingStatus(
        responseData?.onboardingStatus,
      ) ?? 'IN_PROGRESS';

    await saveOnboardingProgress({
      step: Number(responseData.onboardingStep),
      status: onboardingStatus,
    });

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2:
        responseData?.message ??
        'Personal information saved successfully',
    });

    return {
      success: true,
     step: Number(responseData.onboardingStep),
      onboardingStatus,
      data: responseData,
    };
  } catch {
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
export async function vehicleInfoAction(
  payload: VehicleInfoPayload,
) {
  try {
    const result = await onboarding(payload, 2);

    const responseData = result?.data;

    if (!responseData?.success) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          responseData?.message ??
          'Failed to save vehicle information',
      });

      return {
        success: false,
        message:
          responseData?.message ??
          'Failed to save vehicle information',
      };
    }

    const onboardingStatus =
      normalizeOnboardingStatus(
        responseData?.onboardingStatus,
      ) ?? 'IN_PROGRESS';

    await saveOnboardingProgress({
      step: Number(responseData.onboardingStep),
      status: onboardingStatus,
    });

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2:
        responseData?.message ??
        'Vehicle information saved successfully',
    });

    return {
      success: true,
      step: Number(responseData.onboardingStep),
      onboardingStatus,
      data: responseData,
    };
  } catch {
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

export async function submitDocumentsAction(
  payload: Step3Payload,
) {
  try {
    const response = await submitDriverDocuments(payload);

    const data = response?.data;

    if (!data?.success) {
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2:
          data?.message ??
          'Failed to upload documents',
      });

      return {
        success: false,
        message:
          data?.message ??
          'Failed to upload documents',
      };
    }

    const latestStatus =
      normalizeOnboardingStatus(
        data?.onboardingStatus,
      ) ?? 'SUBMITTED';

    const completedStep =
      Number(data?.onboardingStep) || 3;

    await saveOnboardingProgress({
      step: completedStep,
      status: latestStatus,
    });

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2:
        data?.message ??
        'Documents uploaded successfully',
    });

    return {
      success: true,
      step: completedStep,
      onboardingStatus: latestStatus,
      data,
    };
  } catch (error: any) {
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
