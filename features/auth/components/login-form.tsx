import SuccessModal from '@/components/layout/success-modal';
import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import { Spacing } from '@/constants/theme';
import { loginAction } from '@/features/auth/action';
import AuthScreen, { AuthSwitch, FormError } from '@/features/auth/components/auth-screen';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { LoginPayload, LoginSchema } from '../schema';
import Toast from 'react-native-toast-message';
import { saveAuthenticatedAuth } from '@/utils/save-authenticated-auth';
import { saveVerificationAuth } from '@/utils/save-verification-auth';

const onBoardingSteps = [
  'Set up your profile',
  'Set up your vehicle',
  'Upload necessary documents',
  'Review and submit your application',
];

type ModalType = 'verification' | 'onboarding' | null;

type AppRoutes =
  | '/(app)/(auth)/login'
  | '/(app)/(auth)/register'
  | '/(app)/(auth)/reset'
  | '/(app)/(protected)/(tabs)/home'
  | '/(app)/(protected)/onboarding'
  | '/(app)/(verify)/email'
  | '/(app)/(verify)/phone'
  | `/(app)/(protected)/onboarding?step=${number}`
  | `/(app)/(protected)/onboarding?step=${number}&resumeStep=${number}`;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [modalType, setModalType] = useState<ModalType>(null);

  const [modalTitle, setModalTitle] = useState('');

  const [buttonText, setButtonText] = useState('');

  const [redirectPath, setRedirectPath] = useState<AppRoutes>(
    '/(app)/(verify)/phone',
  );

  const [nextSteps, setNextSteps] = useState<string[]>([]);

  const [pendingLogin, setPendingLogin] = useState<Awaited<
    ReturnType<typeof loginAction>
  > | null>(null);

  const router = useRouter();

  const { Colors } = useTheme();

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
      setErrorMessage('');

      const response = await loginAction(data);

      if (!response.success) {
        setValue('password', '');
        setErrorMessage(response.message || 'Login failed');
        return;
      }

      /**
       * =========================
       * VERIFICATION MODAL
       * =========================
       */
      if (response.flow === 'verification') {
        setValue('password', '');

        setPendingLogin(response);

        setModalType('verification');
        setModalTitle('Verification Required');
        setButtonText('Proceed to Verification');

        if (response.verificationMethod === 'email') {
          setRedirectPath('/(app)/(verify)/email');

          setNextSteps([
            'Phone verified successfully',
            'Verify your email address to continue',
          ]);
        } else {
          setRedirectPath('/(app)/(verify)/phone');

          setNextSteps([
            'Verify your phone number first',
            'Then verify your email address',
          ]);
        }

        setShowModal(true);

        return;
      }

      /**
       * =========================
       * AUTHENTICATED
       * =========================
       */
      if (response.flow === 'authenticated') {
        setPendingLogin(response);

        if (
          response.onboardingStatus === 'NOT_STARTED' ||
          response.onboardingStatus === 'IN_PROGRESS'
        ) {
          setModalType('onboarding');
          setModalTitle('Complete Onboarding');
          setButtonText('Continue Onboarding');

          if (response.onboardingStatus === 'NOT_STARTED') {
            const nextStep = 1;

            setRedirectPath(
              `/(app)/(protected)/onboarding?step=${nextStep}&resumeStep=0`,
            );

            setNextSteps(onBoardingSteps);
          } else {
            const completedStep = Number(response.onboardingStep || 0);

            const nextStep = completedStep + 1;

            setRedirectPath(
              `/(app)/(protected)/onboarding?step=${nextStep}&resumeStep=${completedStep}`,
            );

            setNextSteps(onBoardingSteps.slice(completedStep));
          }

          setShowModal(true);

          return;
        }

        /**
         * =========================
         * NO ONBOARDING REQUIRED
         * =========================
         */
        await saveAuthenticatedAuth(response);

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
        });

        router.replace('/(app)/(protected)/(tabs)/home');
      }
    } catch {
      setErrorMessage('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleModalContinue = async () => {
    if (!pendingLogin) {
      return;
    }

    /**
     * =========================
     * VERIFICATION
     * =========================
     */
    if (pendingLogin.success && pendingLogin.flow === 'verification') {
      await saveVerificationAuth({
        verificationToken: pendingLogin.verificationToken,

        verificationEmail: pendingLogin.verificationEmail,

        verificationPhone: pendingLogin.verificationPhone,

        isEmailVerified: pendingLogin.isEmailVerified,

        isPhoneVerified: pendingLogin.isPhoneVerified,
      });
    }

    /**
     * =========================
     * ONBOARDING
     * =========================
     */
    if (pendingLogin.success && pendingLogin.flow === 'authenticated') {
      await saveAuthenticatedAuth({
        accessToken: pendingLogin.accessToken,
        refreshToken: pendingLogin.refreshToken,

        onboardingStatus: pendingLogin.onboardingStatus,

        onboardingStep: pendingLogin.onboardingStep,

        driverId: pendingLogin.driverId,
      });

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
      });
    }

    setShowModal(false);
    setPendingLogin(null);

    router.replace(redirectPath);
  };

  // const onSubmit = async (data: LoginPayload) => {
  //   try {
  //     setLoading(true);

  //     const response = await loginAction(data);

  //     console.log(response);

  //     if (response.unverified) {
  //       setValue('password', '');

  //       setModalType('verification');

  //       setModalTitle('Verification Required');

  //       setButtonText('Proceed to Verification');

  //       if (!response.isPhoneVerified && !response.isEmailVerified) {
  //         setRedirectPath('/(app)/(verify)/phone');

  //         setNextSteps([
  //           'Verify your phone number first',
  //           'Then verify your email address',
  //         ]);
  //       } else if (response.isPhoneVerified && !response.isEmailVerified) {

  //         setRedirectPath('/(app)/(verify)/email');

  //         setNextSteps([
  //           'Phone verified successfully',
  //           'Verify your email address to continue',
  //         ]);
  //       }

  //       setShowModal(true);

  //       return;
  //     }

  //     if (
  //       response.onboardingStatus === 'NOT_STARTED' ||
  //       response.onboardingStatus === 'IN_PROGRESS'
  //     ) {
  //       setModalType('onboarding');

  //       setModalTitle('Complete Onboarding');

  //       setButtonText('Continue Onboarding');

  //       if (response.onboardingStatus === 'NOT_STARTED') {
  //         const nextStep = 1;

  //         setRedirectPath(
  //           `/(app)/(protected)/onboarding?step=${nextStep}&resumeStep=0`,
  //         );

  //         setNextSteps(onBoardingSteps);
  //       } else {
  //         const completedStep = Number(response.onboardingStep || 0);

  //         const nextStep = completedStep + 1;

  //         setRedirectPath(
  //           `/(app)/(protected)/onboarding?step=${nextStep}&resumeStep=${completedStep}`,
  //         );

  //         setNextSteps(onBoardingSteps.slice(completedStep));
  //       }

  //       setShowModal(true);

  //       return;
  //     }

  //     if (!response.success) {
  //       setValue('password', '');

  //       setErrorMessage(response.message || 'Login failed');

  //       return;
  //     }

  //     if (response.status === 'UNDER_REVIEW') {
  //       setShowModal(true);
  //       setModalType('verification');
  //       setModalTitle('Account Under Review');
  //       setNextSteps([
  //         'Your account is currently under review',
  //         'We will notify you once the verification is complete',
  //       ]);
  //     } else {
  //       router.replace('/(app)/(protected)/(tabs)/home');
  //     }
  //   } catch (error) {
  //     console.log(error);

  //     setErrorMessage('Something went wrong');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <AuthScreen title="Welcome back" subtitle="Begin your journey with care">
        <FormError message={errorMessage} />

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

          <Link href={'/forget-password'} asChild>
            <Button variant="text" size="sm" style={styles.forgot}>
              Forgot password?
            </Button>
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

        <AuthSwitch
          prompt="Don't have an account?"
          action="Register"
          onPress={() => router.push('/(app)/(auth)/register')}
        />
      </AuthScreen>

      <SuccessModal
        title={modalTitle}
        path={redirectPath}
        buttonText={buttonText}
        showSuccessModal={showModal}
        nextSteps={nextSteps}
        setShowSuccessModal={setShowModal}
        requireVerification={modalType === 'verification'}
        onContinue={handleModalContinue}
      />
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },

  forgot: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.two,
  },
});
