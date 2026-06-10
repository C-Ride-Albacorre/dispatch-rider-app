import AuthPageHeader from '@/components/layout/auth-header';
import SuccessModal from '@/components/layout/success-modal';

import Button from '@/components/ui/buttons/button';
import IconButton from '@/components/ui/buttons/icon-button';

import OtpInput from '@/components/ui/input/otp-input';

import { Colors, Fonts } from '@/constants/theme';
import ResendOTP from '@/features/auth/components/resend-otp';

import { resendOtpAction, verifyEmailAction } from '@/features/verify/action';
import ExpiredTokenModal from '@/features/verify/components/expired-token-modal';
import { useTheme } from '@/hooks/use-theme';

import { useAuthStore } from '@/store/auth-store';

import { maskEmail } from '@/utils/mask';
import { normalize, scale } from '@/utils/scaling';

import Ionicons from '@expo/vector-icons/Ionicons';

import { Link, useRouter } from 'expo-router';

import { useEffect, useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const router = useRouter();

  const verificationEmail = useAuthStore((state) => state.verificationEmail);

  const verificationToken = useAuthStore((state) => state.verificationToken);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setErrorMessage('Please enter the 6 digit code');

      return;
    }

    if (!verificationEmail || !verificationToken) {
      setErrorMessage('Verification session expired');

      return;
    }

    setLoading(true);

    setErrorMessage('');

    const result = await verifyEmailAction({
      email: verificationEmail,
      otp: code,
      verificationToken,
    });

    setLoading(false);

    console.log('Verification result:', result);

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
    }

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

      <KeyboardAvoidingView
        style={styles.keyboardSafeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            <IconButton
              variant="outlineSecondary"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} style={styles.returnIcon} />
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
            }}
            onChange={(otp) => {
              setCode(otp);

              if (errorMessage) {
                setErrorMessage('');
              }
            }}
          />

          <Button disabled={loading} loading={loading} onPress={handleVerify}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>

          <View style={styles.resendContainer}>
            {/* <TouchableOpacity
              onPress={handleResendOtp}
              disabled={!canResend || resending}
            >
              <Text
                style={[
                  styles.resendText,
                  !canResend && styles.disabledResendText,
                ]}
              >
                {resending
                  ? 'Resending...'
                  : canResend
                    ? 'Resend Code'
                    : `Resend Code in ${countdown}s`}
              </Text>
            </TouchableOpacity> */}

            <ResendOTP
              identifier={verificationEmail}
              verificationToken={verificationToken}
              setErrorMessage={setErrorMessage}
            />

            <TouchableOpacity>
              <Link href="/(app)/(auth)/register" asChild>
                <Text style={styles.resendText}>Change Email</Text>
              </Link>
            </TouchableOpacity>
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
      fontSize: normalize(26),
      fontFamily: Fonts.brandBold,
      color: Colors.text,
    },

    subtitle: {
      fontSize: normalize(16),
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
