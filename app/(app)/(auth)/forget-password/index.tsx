import SuccessModal from '@/components/layout/success-modal';
import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import PhoneInput from '@/components/ui/input/phone-input';
import { forgetPasswordAction } from '@/features/auth/action';
import AuthScreen, { FormError } from '@/features/auth/components/auth-screen';
import MethodTabs, { type MethodTab } from '@/features/auth/components/method-tabs';
import {
  ForgetPasswordPayload,
  forgetPasswordSchema,
} from '@/features/auth/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const METHOD_TABS: MethodTab<'email' | 'phone'>[] = [
  { value: 'email', label: 'Email', icon: 'mail-outline' },
  { value: 'phone', label: 'Phone', icon: 'call-outline' },
];

export default function ForgetPassword() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [successModalVisible, setSuccessModalVisible] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [successData, setSuccessData] = useState<{
    identifier: string;
    method: string;
  } | null>(null);

  const route = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordPayload>({
    resolver: zodResolver(forgetPasswordSchema),

    defaultValues: {
      email: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: ForgetPasswordPayload) => {
    setIsLoading(true);

    try {
      const payload =
        activeTab === 'email'
          ? { email: data.email }
          : { phoneNumber: data.phoneNumber };

      const response = await forgetPasswordAction(payload);

      if (!response.success) {
        setErrorMessage(response.message || 'Failed to send reset code');
        throw new Error(response.message || 'Failed to send reset code');
      }

      if (response.success) {
        setSuccessData({
          identifier: response.identifier,
          method: response.method,
        });

        setSuccessModalVisible(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {successModalVisible && successData && (
        <SuccessModal
          title={`Check your ${
            successData?.method === 'email' ? 'inbox' : 'messages'
          }`}
          description={`We have sent a 6-digit code to your ${
            successData?.method === 'email' ? 'email' : 'phone'
          } (${successData?.identifier}). Please proceed to verify your  ${
            successData?.method === 'email' ? 'email' : 'phone'
          } `}
          buttonText={`Verify account`}
          path="/(app)/(auth)/reset"
          showSuccessModal={successModalVisible}
          setShowSuccessModal={setSuccessModalVisible}
        />
      )}

      <AuthScreen
        title="Reset Password"
        subtitle={`Enter your ${
          activeTab === 'email' ? 'email' : 'phone'
        } address and we will send you a code to reset your password.`}
        onBack={() => router.back()}
      >
        <FormError message={errorMessage} />

        <MethodTabs tabs={METHOD_TABS} value={activeTab} onChange={setActiveTab} />

        <FormError message={errors.email?.message || errors.phoneNumber?.message} />

        {activeTab === 'email' && (
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="john.doe@example.com"
                label="Email address"
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />
        )}

        {activeTab === 'phone' && (
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                placeholder="Enter your phone number"
                label="Phone number"
                onChangePhone={onChange}
                value={value}
                errorMessage={errors.phoneNumber?.message}
              />
            )}
          />
        )}

        <Button size="lg" disabled={isLoading} onPress={handleSubmit(onSubmit)}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </AuthScreen>
    </>
  );
}
