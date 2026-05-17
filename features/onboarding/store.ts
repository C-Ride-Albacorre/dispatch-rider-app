import { create } from 'zustand';
import {
  DriverDocumentType,
  PersonalInfoFormValues,
  UploadDocument,
  VehicleInfoFormValues,
} from './schema';

// ─── State shape ──────────────────────────────────────────────────────────────

interface OnboardingState {
  // Persisted form data per step
  step1Data: Partial<PersonalInfoFormValues>;
  step2Data: Partial<VehicleInfoFormValues>;
  step3Data: Partial<Record<DriverDocumentType, UploadDocument>>;

  // Which step the user is currently on
  currentStep: string;

  // Loading / error state for the API call
  isSubmitting: boolean;
  error: string | null;

  // Actions
  setStep: (step: string) => void;
  saveStep1: (data: PersonalInfoFormValues) => void;
  saveStep2: (data: VehicleInfoFormValues) => void;
  saveDocument: (type: DriverDocumentType, document: UploadDocument) => void;
  removeDocument: (type: DriverDocumentType) => void;
  setSubmitting: (value: boolean) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState = {
  step1Data: {},
  step2Data: {},
  step3Data: {},
  currentStep: '1',
  isSubmitting: false,
  error: null,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  saveStep1: (data) => set({ step1Data: data }),

  saveStep2: (data) => set({ step2Data: data }),

  saveDocument: (type, document) =>
    set((state) => ({ step3Data: { ...state.step3Data, [type]: document } })),

  removeDocument: (type) =>
    set((state) => {
      const updated = { ...state.step3Data };
      delete updated[type];
      return { step3Data: updated };
    }),

  setSubmitting: (value) => set({ isSubmitting: value }),

  setError: (msg) => set({ error: msg }),

  reset: () => set(initialState),
}));
