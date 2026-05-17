import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import PhoneInput from '@/components/ui/input/phone-input';
import Select from '@/components/ui/input/select';
import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { nigeriaCitiesByState, nigeriaStates } from '../../data';
import { PersonalInfoFormValues, personalInfoSchema } from '../../schema';
import { personalInfoAction } from '../../action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOnboardingStore } from '../../store';
import { useEffect } from 'react';

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

      console.log('Result from action:', result);

      handleNextStep();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={24} color={Colors.primary} />
        </View>

        <View style={styles.mainTextContainer}>
          <Text style={styles.mainText}>Personal Information</Text>

          <Text style={styles.subText}>Tell us about yourself</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Full name"
              placeholder="Enter your full name"
              value={value}
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

        <View style={styles.buttonContainer}>
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            Continue
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 20,
    gap: 32,
  },

  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainTextContainer: {
    flex: 1,
  },

  mainText: {
    fontSize: 20,
    fontFamily: Fonts.brandBold,
    color: Colors.text,
  },

  subText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: Fonts.brandRegular,
  },

  form: {
    gap: 24,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});
