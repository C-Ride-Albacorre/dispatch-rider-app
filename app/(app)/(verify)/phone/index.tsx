import Button from '@/components/ui/buttons/button';
import OtpInput from '@/components/ui/input/otp-input';
import AuthScreen from '@/features/auth/components/auth-screen';
import ResendOTP from '@/features/auth/components/resend-otp';
import { verifyPhoneAction } from '@/features/verify/action';
import { useAuthStore } from '@/store/auth-store';
import { clearVerificationAuth } from '@/utils/clear-verification-auth';
import { maskPhone } from '@/utils/mask';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function VerifyPhoneScreen() {
  const [code, setCode] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const goToLogin = async () => {
    await clearVerificationAuth();

    router.replace('/(app)/(auth)/login');
  };

  const verificationPhone = useAuthStore((state) => state.verificationPhone);

  const verificationToken = useAuthStore((state) => state.verificationToken);

  const handleVerify = async (otpCode?: string) => {
    const codeToVerify = otpCode || code;

    if (codeToVerify.length !== 6) {
      setErrorMessage('Please enter the 6 digit code');
      return;
    }

    if (!verificationPhone || !verificationToken) {
      setErrorMessage('Verification session expired');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const result = await verifyPhoneAction({
        phoneNumber: verificationPhone,
        otp: codeToVerify,
        verificationToken,
      });

      console.log('Verification result:', result);

      /**
       * ==========================================
       * FAILED
       * ==========================================
       */
      if (!result.success) {
        /**
         * TOKEN INVALID/EXPIRED
         *
         * Action has already logged the user out.
         * Clear local verification data and go to login.
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
         * CODE INVALID/EXPIRED
         *
         * DO NOT logout.
         *
         * Just show the error underneath the OTP input.
         */
        if (result.codeInvalid) {
          setErrorMessage(
            result.message || 'Invalid or expired verification code',
          );

          return;
        }

        /**
         * Other error.
         */
        setErrorMessage(result.message || 'Verification failed');

        return;
      }

      /**
       * ==========================================
       * SUCCESS
       * ==========================================
       */
      router.push('/(app)/(verify)/email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthScreen
        title="Verify your phone"
        subtitle={`We sent a six digit code to ${maskPhone(verificationPhone || '')}`}
        onBack={goToLogin}
      >
        <OtpInput
          errorMessage={errorMessage}
          onComplete={(otp) => {
            setCode(otp);
            // Auto-submit verification when OTP is complete
            handleVerify(otp);
          }}
          onChange={(otp) => {
            setCode(otp);

            if (errorMessage) {
              setErrorMessage('');
            }
          }}
        />

        <Button size="lg" disabled={loading} loading={loading} onPress={() => handleVerify()}>
          {loading ? 'Verifying...' : 'Verify Phone'}
        </Button>

        <View style={styles.resendContainer}>
          <ResendOTP
            identifier={verificationPhone}
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
