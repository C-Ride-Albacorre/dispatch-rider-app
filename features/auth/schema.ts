import { z } from 'zod';

export const RegisterSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),

  lastName: z.string().min(1, 'Last name is required'),

  email: z.string().min(1, 'Email is required').email('Invalid email address'),

  phoneNumber: z.string().min(1, 'Phone number is required'),

  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterPayload = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),

  password: z.string().min(1, 'Password is required'),
});

export type LoginPayload = z.infer<typeof LoginSchema>;

export const forgetPasswordSchema = z
  .object({
    email: z.string().email('Invalid email address').optional(),
    phoneNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      return !!data.email || !!data.phoneNumber;
    },
    {
      message: 'Email or phone number is required',
      path: ['email'],
    },
  );

export type ForgetPasswordPayload = z.infer<typeof forgetPasswordSchema>;



export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordPayload = z.infer<typeof ResetPasswordSchema>;
