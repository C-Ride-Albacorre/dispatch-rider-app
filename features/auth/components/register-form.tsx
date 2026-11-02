import SuccessModal from '@/components/layout/success-modal';
import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import PhoneInput from '@/components/ui/input/phone-input';
import { Fonts, Spacing } from '@/constants/theme';
import { registerAction } from '@/features/auth/action';
import AuthScreen, { AuthSwitch, FormError } from '@/features/auth/components/auth-screen';
import { useTheme } from '@/hooks/use-theme';
import { getPasswordStrength } from '@/utils/password-strength';
import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { RegisterPayload, RegisterSchema } from '../schema';

export default function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [nextSteps, setNextSteps] = useState<string[]>([]);

  const { Colors } = useTheme();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
    },
  });

  // 🔥 WATCH PASSWORD
  const password = watch('password') || '';

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterPayload) => {
    try {
      setLoading(true);

      const response = await registerAction(data);

      if (!response.success) {
        setErrorMessage(response.message || 'Registration failed');

        setValue('password', '');
        return;
      }

      if (response.success) {
        setNextSteps(response.data.nextSteps);

        setShowSuccessModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessModal
        title="Registration Successful!"
        path="/(app)/(verify)/phone"
        buttonText="Verify Account"
        showSuccessModal={showSuccessModal}
        nextSteps={nextSteps}
        setShowSuccessModal={setShowSuccessModal}
      />

      <AuthScreen title="Become a rider" subtitle="Begin your journey with care">
        <FormError message={errorMessage} />

        <View style={styles.form}>
          {/* FIRST NAME */}
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <Input
                label="First Name"
                placeholder="John"
                value={value}
                onChangeText={onChange}
                error={errors.firstName?.message}
              />
            )}
          />

          {/* LAST NAME */}
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Last Name"
                placeholder="Doe"
                value={value}
                onChangeText={onChange}
                error={errors.lastName?.message}
              />
            )}
          />

          {/* EMAIL */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="john@mail.com"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          {/* PHONE */}
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                label="Phone Number"
                placeholder="(000) 000-0000"
                value={value}
                onChangePhone={onChange}
                errorMessage={errors.phoneNumber?.message}
              />
            )}
          />

          {/* PASSWORD */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Password"
                placeholder="********"
                value={value}
                secureTextEntry={!showPassword}
                onChangeText={onChange}
                rightIcon={
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={Colors.textMuted}
                  />
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
                error={errors.password?.message}
              />
            )}
          />

          {/* PASSWORD STRENGTH */}
          {password.length > 0 && (
            <ThemedText style={[styles.strength, { color: passwordStrength.color }]}>
              Password Strength: {passwordStrength.label}
            </ThemedText>
          )}
        </View>

        {/* SUBMIT */}
        <Button
          size="lg"
          loading={loading}
          disabled={loading}
          onPress={handleSubmit(onSubmit)}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </Button>

        {/* FOOTER */}
        <AuthSwitch
          prompt="Already have an account?"
          action="Login"
          onPress={() => router.push('/(app)/(auth)/login')}
        />
      </AuthScreen>
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },

  strength: {
    fontFamily: Fonts.brandMedium,
    fontSize: 13,
    lineHeight: 18,
    marginTop: -Spacing.two,
  },
});
