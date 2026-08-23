import AuthPageHeader from '@/components/layout/auth-header';

import Button from '@/components/ui/buttons/button';
import ReturnButton from '@/components/ui/buttons/return-button';

import OtpInput from '@/components/ui/input/otp-input';

import { Fonts } from '@/constants/theme';
import ResendOTP from '@/features/auth/components/resend-otp';
import { verifyPhoneAction } from '@/features/verify/action';
import { useTheme } from '@/hooks/use-theme';

import { useAuthStore } from '@/store/auth-store';

import { maskPhone } from '@/utils/mask';
import { normalize, scale } from '@/utils/scaling';
import { clearVerificationData } from '@/utils/token-storage';

import Toast from 'react-native-toast-message';

import { useRouter } from 'expo-router';

import { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import IconButton from '@/components/ui/buttons/icon-button';
import { Ionicons } from '@expo/vector-icons';
import { clearVerificationAuth } from '@/utils/clear-verification-auth';

export default function VerifyPhoneScreen() {
  const [code, setCode] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

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
      <KeyboardAvoidingView
        style={styles.keyboardSafeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          bounces={false}
          scrollEnabled={true}
        >
          <View>
            <IconButton variant="outlineSecondary" onPress={goToLogin}>
              <Ionicons name="arrow-back" size={20} style={styles.returnIcon} />
            </IconButton>

            <AuthPageHeader />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Verify your phone</Text>

            <Text style={styles.subtitle}>
              We sent a six digit code to {maskPhone(verificationPhone || '')}
            </Text>
          </View>

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

          <Button disabled={loading} loading={loading} onPress={handleVerify}>
            {loading ? 'Verifying...' : 'Verify Phone'}
          </Button>

          <View style={styles.resendContainer}>
            <ResendOTP
              identifier={verificationPhone}
              verificationToken={verificationToken}
              setErrorMessage={setErrorMessage}
            />

            {/* <TouchableOpacity>
              <Link href="/(app)/(auth)/register" asChild>
                <Text style={styles.resendText}>Change Phone</Text>
              </Link>
            </TouchableOpacity> */}
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
