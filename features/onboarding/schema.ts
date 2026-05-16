import { z } from 'zod';

// ─── Step 1 – Personal Information ───────────────────────────────────────────

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').trim(),

  phoneNumber: z.string().min(7, 'Enter a valid phone number').trim(),

  email: z.string().min(1, 'Email is required').email('Invalid email address'),

  address: z.string().min(1, 'Address is required').trim(),

  state: z.string().min(1, 'Please select a state'),

  city: z.string().min(1, 'Please select a city'),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

// ─── Step 2 – Vehicle Information ────────────────────────────────────────────

export const vehicleTypes = ['CAR', 'TRUCK', 'MOTORCYCLE', 'VAN'] as const;
export type VehicleType = (typeof vehicleTypes)[number];

export const vehicleInfoSchema = z.object({
  vehicleType: z.enum(vehicleTypes, {
    message: 'Please select a vehicle type',
  }),

  vehicleMake: z.string().min(1, 'Vehicle make is required').trim(),

  vehicleModel: z.string().min(1, 'Vehicle model is required').trim(),

  year: z
    .int()
    .min(1990, 'Year must be 1990 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),

  licensePlate: z.string().min(5, 'Enter a valid license plate').trim(),
});

export type VehicleInfoFormValues = z.infer<typeof vehicleInfoSchema>;

// ─── Combined type (useful for Zustand store) ─────────────────────────────────

export type OnboardingStepData =
  | { step: 1; data: PersonalInfoFormValues }
  | { step: 2; data: VehicleInfoFormValues };
