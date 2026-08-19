import { useAuthStore } from "@/store/auth-store";
import { saveOnboardingStatus, saveOnboardingStep } from "./token-storage";

export const saveOnboardingProgress = async ({
  step,
  status,
}: {
  step: number;
  status?: string;
}) => {
  await saveOnboardingStep(step);

  const currentStatus =
    status ??
    useAuthStore.getState().onboardingStatus ??
    'IN_PROGRESS';

  await saveOnboardingStatus(currentStatus);

  useAuthStore.getState().setAuth({
    onboardingStep: step,
    onboardingStatus: currentStatus,
  });
};