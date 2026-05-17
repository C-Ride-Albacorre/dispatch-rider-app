import AuthPageHeader from '@/components/layout/auth-header';
import SuccessModal from '@/components/layout/success-modal';
import Button from '@/components/ui/buttons/button';
import ErrorMessage from '@/components/ui/error/error-message';
import Input from '@/components/ui/input/input';
import { Colors, Fonts } from '@/constants/theme';
import { loginAction } from '@/features/auth/action';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { LoginPayload, LoginSchema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';

const onBoardingSteps = [
  'Set up your profile',
  'Set up your vehicle',
  'Upload necessary documents',
  'Review and submit your application',
];

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [redirectPath, setRedirectPath] = useState<
    '/(app)/(verify)/phone' | '/(app)/(verify)/email'
  >('/(app)/(verify)/phone');

  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginPayload) => {
    try {
      setLoading(true);

      const response = await loginAction(data);

      console.log(response);

      // FAILED LOGIN
      if (!response.success) {
        setValue('password', '');

        setErrorMessage(response.message || 'Login failed');

        return;
      }

      // UNVERIFIED FLOW
      if (response.unverified) {
        setValue('password', '');

        // PHONE FIRST
        if (!response.isPhoneVerified && !response.isEmailVerified) {
          setRedirectPath('/(app)/(verify)/phone');

          setNextSteps([
            'Verify your phone number first',
            'Then verify your email address',
          ]);
        }

        // EMAIL NEXT
        else if (response.isPhoneVerified && !response.isEmailVerified) {
          setRedirectPath('/(app)/(verify)/email');

          setNextSteps([
            'Phone verified successfully',
            'Verify your email address to continue',
          ]);
        }

        setShowSuccessModal(true);

        return;
      }

      if (response.status === 'PENDING_ONBOARDING') {
        if (response.onboardingStatus === 'NOT_STARTED') {
          setNextSteps(onBoardingSteps);

          setShowSuccessModal(true);

          return;
        }
      }

      // VERIFIED USER
      router.replace('/(app)/(protected)/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.keyboardSafeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            {/* <TouchableOpacity
            style={styles.returnBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity> */}

            <AuthPageHeader />
          </View>

          {errorMessage && <ErrorMessage message={errorMessage} />}

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Email"
                  placeholder="john.doe@example.com"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Password"
                  placeholder="********"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!showPassword}
                  rightIcon={
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="#999"
                    />
                  }
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  error={errors.password?.message}
                />
              )}
            />

            <View style={styles.forgotPasswordContainer}>
              <Link href={'/forget-password'} asChild>
                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            <Button
              size="lg"
              loading={loading}
              disabled={loading}
              onPress={handleSubmit(onSubmit)}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <View style={styles.action}>
              <Text style={styles.actionText}>Don't have an account?</Text>

              <Link href={'/(app)/(auth)/register'} asChild>
                <TouchableOpacity>
                  <Text style={styles.actionLink}>Register</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <SuccessModal
        title="Verification Required"
        path={redirectPath}
        buttonText="Proceed to Verification"
        showSuccessModal={showSuccessModal}
        nextSteps={nextSteps}
        setShowSuccessModal={setShowSuccessModal}
        requireVerification
      />
      <SuccessModal
        title="Start Onboarding"
        path="/(app)/(protected)/onboarding"
        buttonText="Go to Onboarding"
        showSuccessModal={showSuccessModal}
        nextSteps={onBoardingSteps}
        setShowSuccessModal={setShowSuccessModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  keyboardSafeArea: {
    flex: 1,
  },

  container: {
    padding: 20,
    flexGrow: 1,
    gap: 32,
  },

  form: {
    // marginTop: 32,
    gap: 24,
  },

  returnBtn: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 40,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  forgotPasswordContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },

  forgotPasswordText: {
    color: Colors.primary,
    fontFamily: Fonts.brandMedium,
    fontSize: 16,
  },

  action: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },

  actionText: {
    color: Colors.text,
    fontFamily: Fonts.brandMedium,
    fontSize: 16,
  },

  actionLink: {
    color: Colors.primary,
    fontFamily: Fonts.brandSemiBold,
    fontSize: 16,
  },
});
