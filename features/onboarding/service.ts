import { api } from '@/libs/api';
import { VehicleInfoPayload } from './action';
import { PersonalInfoFormValues, Step3Payload } from './schema';

export type Step1Payload = PersonalInfoFormValues;
export type Step2Payload = VehicleInfoPayload;

type StepPayloadMap = {
  1: Step1Payload;
  2: Step2Payload;
};

export interface OnboardingStepResponse {
  status: string;
  statusCode: number;
  timestamp: string;
  path: string;

  data: {
    success: boolean;
    message: string;
    onboardingStatus: string;
    onboardingStep: number;
    status: string;
  };
}

export const VehicleType = {
  CAR: 'CAR',
  EV: 'EV',
  E_BIKE: 'E_BIKE',
  MOTORCYCLE: 'MOTORCYCLE',
} as const;

export type VehicleTypeValue = (typeof VehicleType)[keyof typeof VehicleType];

export interface VehicleTypeConfig {
  id: string;
  name: string;
  icon?: string | null;
  vehicleType?: VehicleTypeValue | string | null;
  type?: VehicleTypeValue | string | null;
}

interface VehicleTypeConfigsResponse {
  status: string;
  statusCode: number;
  timestamp: string;
  path: string;
  data: VehicleTypeConfig[];
}

export async function getVehicleTypeConfigs(): Promise<VehicleTypeConfig[]> {
  const response = await api.get<VehicleTypeConfigsResponse>(
    '/vehicle-types/configs',
  );

  return response.data.data ?? [];
}

export async function onboarding<S extends keyof StepPayloadMap>(
  payload: StepPayloadMap[S],
  step: S,
): Promise<OnboardingStepResponse> {
  const response = await api.post(
    `/driver/driver/onboarding/${step}/`,
    payload,
  );

  return response.data;
}

export async function submitDriverDocuments(payload: Step3Payload) {
  const formData = new FormData();

  const metadata = payload.documents.map((doc) => ({
    documentType: doc.documentType,
    description: doc.description,
  }));

  formData.append('documentsMetadata', JSON.stringify(metadata));

  payload.documents.forEach((doc) => {
    formData.append('documents', {
      uri: doc.uri,
      name: doc.name,
      type: doc.mimeType,
    } as any);
  });

  const response = await api.post('/driver/onboarding/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
