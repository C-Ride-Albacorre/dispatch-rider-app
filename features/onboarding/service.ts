import { api } from '@/libs/api';
import { PersonalInfoFormValues, Step3Payload, VehicleInfoFormValues } from './schema';
import { VehicleInfoPayload } from './action';

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
