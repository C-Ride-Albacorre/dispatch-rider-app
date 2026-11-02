import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import PhoneInput from '@/components/ui/input/phone-input';
import Select from '@/components/ui/input/select';
import { Spacing } from '@/constants/theme';
import StepCard, { StepActions, stepActionStyles } from '@/features/onboarding/components/step-card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { personalInfoAction } from '../../action';
import { nigeriaCitiesByState, nigeriaStates } from '../../data';
import { PersonalInfoFormValues, personalInfoSchema } from '../../schema';
import { useOnboardingStore } from '../../store';

export default function PersonalInfo({
  goToStep,
}: {
  goToStep: (step: number) => void;
}) {
  const { step1Data, isSubmitting, error, setError, setSubmitting } =
    useOnboardingStore();

  const handleNextStep = () => {
    goToStep(2);
  };

  const {
    control,
    watch,
    handleSubmit,
    setValue,

    formState: { errors, isValid },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),

    defaultValues: {
      fullName: step1Data.fullName ?? '',
      phoneNumber: step1Data.phoneNumber ?? '',
      email: step1Data.email ?? '',
      address: step1Data.address ?? '',
      state: step1Data.state ?? '',
      city: step1Data.city ?? '',
    },

    mode: 'onTouched',
  });

  const selectedState = watch('state');

  useEffect(() => {
    setValue('city', '');
  }, [selectedState]);

  const cityOptions = selectedState
    ? (nigeriaCitiesByState[selectedState] ?? [])
    : [];

  const onSubmit = async (payload: PersonalInfoFormValues) => {
    try {
      setSubmitting(true);
      setError(null);

      const result = await personalInfoAction(payload);

      if (!result.success) return;

      console.log('Result from action:', result);

      handleNextStep();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StepCard
      icon="person-outline"
      title="Personal Information"
      subtitle="Tell us about yourself"
    >
      <View style={styles.form}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Full name"
              placeholder="Enter your full name"
              value={value}
                required
              onChangeText={onChange}
              error={errors.fullName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { value, onChange } }) => (
            <PhoneInput
              label="Phone number"
              placeholder="Enter your phone number"
              value={value}
                required
              onChangePhone={onChange}
              errorMessage={errors.phoneNumber?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Email"
              placeholder="Enter your email address"
              value={value}
                required
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Address"
              placeholder="Enter your address here"
                required
              value={value}
              onChangeText={onChange}
              error={errors.address?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="state"
          render={({ field: { value, onChange } }) => (
            <Select
              label="State"
              required
              value={value}
              onChange={onChange}
              options={nigeriaStates}
              error={errors.state?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field: { value, onChange } }) => (
            <Select
              label="City"
                required
              placeholder={
                selectedState ? 'Select your city' : 'Select a state first'
              }
              value={value}
              onChange={onChange}
              options={cityOptions}
              disabled={!selectedState || cityOptions.length === 0}
              error={errors.city?.message}
            />
          )}
        />

        <StepActions>
          <Button variant="outline" size="lg" disabled style={stepActionStyles.button}>
            Previous
          </Button>
          <Button
            size="lg"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            style={stepActionStyles.button}
          >
            Continue
          </Button>
        </StepActions>
      </View>
    </StepCard>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
});
