import Toast from 'react-native-toast-message';
import { PersonalInfoFormValues, Step3Payload, VehicleInfoFormValues } from './schema';
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
  try {
    const result = await submitDriverDocuments(payload);

    const responseData = result?.data;

    if (!responseData?.success) {
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: responseData?.message ?? 'Failed to upload documents',
      });

      return {
        success: false,
        message: responseData?.message ?? 'Failed to upload documents',
      };
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: responseData?.message ?? 'Documents uploaded successfully',
    });

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'An unexpected error occurred while uploading documents',
    });

    return {
      success: false,
      message: 'An unexpected error occurred while uploading documents',
    };
  }
}
