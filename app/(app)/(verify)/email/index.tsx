import SuccessModal from '@/components/layout/success-modal';
import Button from '@/components/ui/buttons/button';
import OtpInput from '@/components/ui/input/otp-input';
import AuthScreen from '@/features/auth/components/auth-screen';
import ResendOTP from '@/features/auth/components/resend-otp';
import { verifyEmailAction } from '@/features/verify/action';
import { useAuthStore } from '@/store/auth-store';
import { clearVerificationAuth } from '@/utils/clear-verification-auth';
import { maskEmail } from '@/utils/mask';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

const onBoardingSteps = [
  'Set up your profile',
  'Set up your vehicle',
  'Upload necessary documents',
  'Review and submit your application',
];

export default function VerifyEmailScreen() {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const router = useRouter();

  const verificationEmail = useAuthStore((state) => state.verificationEmail);

  const verificationToken = useAuthStore((state) => state.verificationToken);

  /**
   * ==========================================
   * GO TO LOGIN
   * ==========================================
   */
  const goToLogin = async () => {
    await clearVerificationAuth();

    router.replace('/(app)/(auth)/login');
  };

  /**
   * ==========================================
   * VERIFY EMAIL
   * ==========================================
   */
  const handleVerify = async (otpCode?: string) => {
    const codeToVerify = otpCode || code;

    if (codeToVerify.length !== 6) {
      setErrorMessage('Please enter the 6 digit code');
      return;
    }

    if (!verificationEmail || !verificationToken) {
      setErrorMessage('Verification session expired');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const result = await verifyEmailAction({
        email: verificationEmail,
        otp: codeToVerify,
        verificationToken,
      });

      /**
       * ==========================================
       * VERIFICATION FAILED
       * ==========================================
       */
      if (!result.success) {
        /**
         * TOKEN INVALID / EXPIRED
         */
        if (result.tokenExpired) {
          Toast.show({
            type: 'error',
            text1: 'Session Expired',
            text2: 'Please login again to continue',
          });

          await goToLogin();

          return;
        }

        /**
         * OTP/CODE INVALID / EXPIRED
         */
        if (result.codeInvalid) {
          setErrorMessage(
            result.message || 'Invalid or expired verification code',
          );

          return;
        }

        /**
         * Any other verification error.
         */
        setErrorMessage(result.message || 'Verification failed');

        return;
      }

      /**
       * ==========================================
       * SUCCESS
       * ==========================================
       */
      setShowSuccessModal(true);
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <>
      <SuccessModal
        title="Account Verified!"
        path="/(app)/(protected)/onboarding"
        buttonText="Go to Onboarding"
        showSuccessModal={showSuccessModal}
        nextSteps={onBoardingSteps}
        setShowSuccessModal={setShowSuccessModal}
      />

      <AuthScreen
        title="Verify your email"
        subtitle={`We sent a six digit code to ${maskEmail(verificationEmail || '')}`}
        onBack={goToLogin}
      >
        <OtpInput
          errorMessage={errorMessage}
          onComplete={(otp) => {
            setCode(otp);
            handleVerify(otp);
          }}
          onChange={(otp) => {
            setCode(otp);

            if (errorMessage) {
              setErrorMessage('');
            }
          }}
        />

        <Button
          size="lg"
          disabled={loading}
          loading={loading}
          onPress={() => handleVerify()}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </Button>

        <View style={styles.resendContainer}>
          <ResendOTP
            identifier={verificationEmail}
            verificationToken={verificationToken}
            setErrorMessage={setErrorMessage}
          />
        </View>
      </AuthScreen>
    </>
  );
}

const styles = StyleSheet.create({
  resendContainer: {
    alignItems: 'center',
  },
});
