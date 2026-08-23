import AuthPageHeader from '@/components/layout/auth-header';
import SuccessModal from '@/components/layout/success-modal';

import Button from '@/components/ui/buttons/button';
import IconButton from '@/components/ui/buttons/icon-button';

import OtpInput from '@/components/ui/input/otp-input';

import { Fonts } from '@/constants/theme';
import ResendOTP from '@/features/auth/components/resend-otp';

import { verifyEmailAction } from '@/features/verify/action';
import { useTheme } from '@/hooks/use-theme';

import { useAuthStore } from '@/store/auth-store';

import { maskEmail } from '@/utils/mask';
import { normalize, scale } from '@/utils/scaling';
import { clearVerificationData } from '@/utils/token-storage';

import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import { useRouter } from 'expo-router';

import { useEffect, useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { clearVerificationAuth } from '@/utils/clear-verification-auth';

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

  const { Colors } = useTheme();
  const styles = createStyles(Colors);

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

      console.log('Verification result:', result);

      /**
       * ==========================================
       * VERIFICATION FAILED
       * ==========================================
       */
      if (!result.success) {
        /**
         * TOKEN INVALID / EXPIRED
         *
         * The action already logs the user out.
         *
         * We clear the verification data and
         * send the user back to login.
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
         *
         * IMPORTANT:
         * Do NOT logout.
         *
         * Keep the verification token alive so
         * the user can retry or resend the OTP.
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
    } catch (error) {
      console.log('Email verification screen error:', error);

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

      <KeyboardAvoidingView
        style={styles.keyboardSafeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          bounces={false}
          scrollEnabled
        >
          <View>
            <IconButton variant="outlineSecondary" onPress={goToLogin}>
              <Ionicons name="arrow-back" size={20} style={styles.returnIcon} />
            </IconButton>

            <AuthPageHeader />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Verify your email</Text>

            <Text style={styles.subtitle}>
              We sent a six digit code to {maskEmail(verificationEmail || '')}
            </Text>
          </View>

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
      paddingHorizontal: scale(20),
      paddingBottom: scale(20),
      paddingTop: scale(12),
      flexGrow: 1,
      gap: scale(24),
    },

    returnIcon: {
      color: Colors.textSecondary,
    },

    textContainer: {
      gap: 8,
      alignItems: 'center',
      marginVertical: scale(20),
    },

    title: {
      fontSize: normalize(24),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },

    subtitle: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandRegular,
      color: Colors.textSecondary,
      textAlign: 'center',
    },

    resendContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: scale(20),
      gap: scale(16),
    },

    resendText: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandMedium,
      color: Colors.primary,
    },

    disabledResendText: {
      color: Colors.textSecondary,
    },
  });
