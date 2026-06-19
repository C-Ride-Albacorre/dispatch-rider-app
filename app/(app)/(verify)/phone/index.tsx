import AuthPageHeader from '@/components/layout/auth-header';

import Button from '@/components/ui/buttons/button';
import IconButton from '@/components/ui/buttons/icon-button';

import OtpInput from '@/components/ui/input/otp-input';

import { Colors, Fonts } from '@/constants/theme';
import ResendOTP from '@/features/auth/components/resend-otp';
import { resendOtpAction, verifyPhoneAction } from '@/features/verify/action';
import ExpiredTokenModal from '@/features/verify/components/expired-token-modal';
import { useTheme } from '@/hooks/use-theme';

import { useAuthStore } from '@/store/auth-store';

import { maskPhone } from '@/utils/mask';
import { normalize, scale } from '@/utils/scaling';

import Ionicons from '@expo/vector-icons/Ionicons';

import { Icon, Link, useRouter } from 'expo-router';

import { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function VerifyPhoneScreen() {
  const [code, setCode] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const [showExpiredModal, setShowExpiredModal] = useState(false);

  const router = useRouter();

  const verificationPhone = useAuthStore((state) => state.verificationPhone);

  const verificationToken = useAuthStore((state) => state.verificationToken);

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setErrorMessage('Please enter the 6 digit code');

      return;
    }

    if (!verificationPhone || !verificationToken) {
      setErrorMessage('Verification session expired');

      return;
    }

    setLoading(true);

    setErrorMessage('');

    const result = await verifyPhoneAction({
      phoneNumber: verificationPhone,
      otp: code,
      verificationToken,
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
    }

    // 🔥 SUCCESS
    router.push('/(app)/(verify)/email');
  };

  return (
    <>
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
            variant='outlineSecondary'

            >
              <Ionicons name="arrow-back" size={24} style={styles.returnIcon} />
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
