import AuthPageHeader from '@/components/layout/auth-header';

import Button from '@/components/ui/buttons/button';

import ErrorMessage from '@/components/ui/error/error-message';

import Input from '@/components/ui/input/input';

import PhoneInput from '@/components/ui/input/phone-input';

import { Fonts } from '@/constants/theme';

import { registerAction } from '@/features/auth/action';

import { getPasswordStrength } from '@/utils/password-strength';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useRouter } from 'expo-router';

import { useState } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SuccessModal from '@/components/layout/success-modal';
import { RegisterPayload, RegisterSchema } from '../schema';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';

export default function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [nextSteps, setNextSteps] = useState<string[]>([]);

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

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

      <KeyboardAvoidingView
        style={styles.keyboardSafeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View>
           <AuthPageHeader />
          </View>

          {errorMessage && <ErrorMessage message={errorMessage} />}

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
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={22}
                      color="#999"
                    />
                  }
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  error={errors.password?.message}
                />
              )}
            />

            {/* PASSWORD STRENGTH */}
            {password.length > 0 && (
              <Text
                style={{
                  color: passwordStrength.color,

                  fontSize: 13,

                  fontFamily: Fonts.brandMedium,
                }}
              >
                Password Strength: {passwordStrength.label}
              </Text>
            )}

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
            <View style={styles.action}>
              <Text style={styles.actionText}>Already have an account?</Text>

              <TouchableOpacity
                onPress={() => router.push('/(app)/(auth)/login')}
              >
                <Text style={styles.actionLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    keyboardSafeArea: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    container: {
      padding: scale(20),
      flexGrow: 1,
      gap: scale(32),
    },

    form: {
      // marginTop: 20,
      gap: scale(24),
    },

    action: {
      flexDirection: 'row',

      justifyContent: 'center',

      gap: scale(4),
    },

    actionText: {
      color: Colors.text,

      fontFamily: Fonts.brandMedium,

      fontSize: normalize(16),
    },

    actionLink: {
      color: Colors.primary,

      fontFamily: Fonts.brandSemiBold,

      fontSize: normalize(16),
    },
  });
