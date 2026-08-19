import AuthPageHeader from '@/components/layout/auth-header';

import Button from '@/components/ui/buttons/button';
import IconButton from '@/components/ui/buttons/icon-button';
import ReturnButton from '@/components/ui/buttons/return-button';

import OtpInput from '@/components/ui/input/otp-input';

import { Fonts } from '@/constants/theme';
import { VerifyResetAction } from '@/features/auth/action';
import ExpiredTokenModal from '@/features/verify/components/expired-token-modal';
import { useTheme } from '@/hooks/use-theme';

import { normalize, scale } from '@/utils/scaling';
import {
  getVerificationIdentifier,
  getVerificationMethod,
} from '@/utils/token-storage';

import Ionicons from '@expo/vector-icons/Ionicons';

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

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

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
    console.log(' Verify reset result:', result);

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
           <ReturnButton />

            <AuthPageHeader />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Verify your account</Text>

            <Text style={styles.subtitle}>
              Enter the 6 digit code sent to{' '}
              {verificationMethod === 'email' ? 'your email' : 'your phone'}
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
            {loading ? 'Verifying...' : 'Verify Account'}
          </Button>
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
