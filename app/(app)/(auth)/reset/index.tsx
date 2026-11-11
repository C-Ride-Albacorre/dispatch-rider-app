import Button from '@/components/ui/buttons/button';
import OtpInput from '@/components/ui/input/otp-input';
import { VerifyResetAction } from '@/features/auth/action';
import AuthScreen from '@/features/auth/components/auth-screen';
import ExpiredTokenModal from '@/features/verify/components/expired-token-modal';
import {
  getVerificationIdentifier,
  getVerificationMethod,
} from '@/utils/token-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function VerifyResetScreen() {
  const [code, setCode] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const [verificationIdentifier, setVerificationIdentifier] = useState<
    string | null
  >(null);

  const [verificationMethod, setVerificationMethod] = useState<string | null>(
    null,
  );

  const router = useRouter();

  useEffect(() => {
    const loadVerificationData = async () => {
      const identifier = await getVerificationIdentifier();
      const method = await getVerificationMethod();
      setVerificationIdentifier(identifier);
      setVerificationMethod(method);
    };

    loadVerificationData();
  }, []);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setErrorMessage('Please enter the 6 digit code');

      return;
    }

    if (!verificationIdentifier || !verificationMethod) {
      setErrorMessage('Verification failed. Please request a new reset code.');

      return;
    }

    setLoading(true);

    const result = await VerifyResetAction({
      identifier: verificationIdentifier,
      otp: code,
    });

    setLoading(false);

    if (!result.success) {
      // expired token/code
      // if (result.expired) {
      //   setShowExpiredModal(true);
      //   return;
      // }

      // invalid otp
      if (result.invalid) {
        setErrorMessage(result.message || 'Invalid verification code');
        return;
      }

      setErrorMessage(result.message || 'Verification failed');

      return;
    } else {
      // 🔥 SUCCESS
      router.push('/(app)/(auth)/reset-password');
    }
  };

  return (
    <>
      <ExpiredTokenModal
        showExpiredModal={showExpiredModal}
        setShowExpiredModal={setShowExpiredModal}
      />
      <AuthScreen
        title="Verify your account"
        subtitle={`Enter the 6 digit code sent to ${
          verificationMethod === 'email' ? 'your email' : 'your phone'
        }`}
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
          {loading ? 'Verifying...' : 'Verify Account'}
        </Button>
      </AuthScreen>
    </>
  );
}
