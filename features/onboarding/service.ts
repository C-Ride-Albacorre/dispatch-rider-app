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

  for (const doc of payload.documents) {
    console.log('Processing document:', doc);

    const blobResponse = await fetch(doc.uri);

    if (!blobResponse.ok) {
      throw new Error(
        `Failed to load document "${doc.name}": ${blobResponse.status} ${blobResponse.statusText}`,
      );
    }

    const blob = await blobResponse.blob();

    const file = new File([blob], doc.name, {
      type: doc.mimeType,
    });

    formData.append('documents', file);
  }

  for (const pair of formData.entries()) {
    console.log('FORM DATA ENTRY:', pair);
  }

  const response = await api.post('/driver/onboarding/submit', formData, {
    headers: {
      Accept: 'application/json',
      'Content-Type': undefined,
    },
  });

  return response.data;
}
