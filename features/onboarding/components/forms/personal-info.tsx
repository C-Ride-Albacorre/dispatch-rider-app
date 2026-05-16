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

export default function PersonalInfo({
  setStep,
}: {
  setStep: (step: string) => void;
}) {
  const { step1Data, isSubmitting, error, setError } = useOnboardingStore();

  const handleNextStep = () => {
    setStep('2');
  };

  const {
    control,
    watch,
    handleSubmit,
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

    mode: 'onChange',
  });

  const selectedState = watch('state');

  const cityOptions = selectedState
    ? (nigeriaCitiesByState[selectedState] ?? [])
    : [];

  const onSubmit = (payload: PersonalInfoFormValues) => {
    try {
      const result = personalInfoAction(payload);

      console.log('Result from action:', result);
    } catch (error) {
      console.error('Error submitting personal info:', error);
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
            />
          )}
        />

        <View style={styles.buttonContainer}>
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button onPress={handleSubmit(onSubmit)} disabled>
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
