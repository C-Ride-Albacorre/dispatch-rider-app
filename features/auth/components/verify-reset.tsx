import SuccessModal from '@/components/layout/success-modal';
import Button from '@/components/ui/buttons/button';
import OtpInput from '@/components/ui/input/otp-input';
import AuthScreen from '@/features/auth/components/auth-screen';
import ExpiredTokenModal from '@/features/verify/components/expired-token-modal';
import { useAuthStore } from '@/store/auth-store';
import { maskEmail } from '@/utils/mask';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

const onBoardingSteps = [
  'Set up your profile',
  'Set up your vehicle',
  'Upload necessary documents',
  'Review and submit your application',
];

export default function ResetVerifyEmailScreen() {
  const [code, setCode] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const router = useRouter();

  const verificationEmail = useAuthStore((state) => state.verificationEmail);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setErrorMessage('Please enter the 6 digit code');

      return;
    }

    if (!verificationEmail) {
      setErrorMessage('Verification session expired');

      return;
    }

    setLoading(true);

    setErrorMessage('');

    // const result = await verifyEmailAction({

    // });

    setLoading(false);

    // console.log('Verification result:', result);

    // if (!result.success) {

    //   if (result.invalid) {
    //     setErrorMessage(result.message || 'Invalid verification code');
    //     return;
    //   }

    //   setErrorMessage(result.message || 'Verification failed');

    //   return;
    // }

    // 🔥 SUCCESS
    setShowSuccessModal(true);
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

      <ExpiredTokenModal
        showExpiredModal={showExpiredModal}
        setShowExpiredModal={setShowExpiredModal}
      />

      <AuthScreen
        title="Verify your email"
        subtitle={`We sent a six digit code to ${maskEmail(verificationEmail || '')}`}
        onBack={() => router.back()}
      >
        <OtpInput
          errorMessage={errorMessage}
          onComplete={(otp) => {
            setCode(otp);
          }}
          onChange={(otp) => {
            setCode(otp);

            if (errorMessage) {
              setErrorMessage('');
            }
          }}
        />

        <Button size="lg" disabled={loading} loading={loading} onPress={handleVerify}>
          {loading ? 'Verifying...' : 'Verify Email'}
        </Button>

        {/* <Button variant="text" size="sm" onPress={() => router.push('/(app)/(auth)/forget-password')}>
          Change Email
        </Button> */}
      </AuthScreen>
    </>
  );
}
