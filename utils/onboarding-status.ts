const INCOMPLETE_ONBOARDING_STATUSES = ['NOT_STARTED', 'IN_PROGRESS'] as const;

const COMPLETED_ONBOARDING_STATUSES = [
  'COMPLETED',
  'UNDER_REVIEW',
  'SUBMITTED',
  'ACTIVE',
  'APPROVED',
] as const;

export const normalizeOnboardingStatus = (status: string | null | undefined) =>
  status?.trim().toUpperCase() ?? null;

export const requiresOnboarding = (status: string | null | undefined) => {
  const normalized = normalizeOnboardingStatus(status);

  if (!normalized) return true;

  return INCOMPLETE_ONBOARDING_STATUSES.includes(
    normalized as (typeof INCOMPLETE_ONBOARDING_STATUSES)[number],
  );
};

export const isOnboardingResolved = (status: string | null | undefined) => {
  const normalized = normalizeOnboardingStatus(status);

  if (!normalized) return false;

  return COMPLETED_ONBOARDING_STATUSES.includes(
    normalized as (typeof COMPLETED_ONBOARDING_STATUSES)[number],
  );
};
