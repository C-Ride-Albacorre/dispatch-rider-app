import { api } from '@/libs/api';
import { PersonalInfoFormValues, VehicleInfoFormValues } from './schema';

export type Step1Payload = PersonalInfoFormValues;
export type Step2Payload = VehicleInfoFormValues;

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
