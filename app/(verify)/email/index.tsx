import AuthPageHeader from '@/components/layout/auth-header';

import Button from '@/components/ui/buttons/button';

import OtpInput from '@/components/ui/input/otp-input';

import { Colors, Fonts } from '@/constants/theme';

import { verifyEmailAction, verifyPhoneAction } from '@/features/verify/action';

import { useAuthStore } from '@/store/auth-store';

import { maskPhone } from '@/utils/mask';

import Ionicons from '@expo/vector-icons/Ionicons';

import { Link, useRouter } from 'expo-router';

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

export default function VerifyEmailScreen() {
  const [code, setCode] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(false);

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

    if (!result.success) {
      setErrorMessage(result.message || 'Invalid verification code');

      return;
    }

    // 🔥 SUCCESS
    router.replace('/onboarding');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardSafeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <TouchableOpacity
            style={styles.returnBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>

          <AuthPageHeader />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Verify your email</Text>

          <Text style={styles.subtitle}>
            We sent a six digit code to {maskPhone(verificationEmail || '')}
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
          <TouchableOpacity>
            <Text style={styles.resendText}>Resend Code</Text>
          </TouchableOpacity>

          <TouchableOpacity>

            <Link href="/(auth)/register" asChild>
              <Text style={styles.resendText}>Change Email</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardSafeArea: {
    flex: 1,
  },

  container: {
    padding: 20,
    flexGrow: 1,
    gap: 24,
  },

  returnBtn: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 40,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContainer: {
    gap: 8,
    alignItems: 'center',
    marginVertical: 20,
  },

  title: {
    fontSize: 26,
    fontFamily: Fonts.brandBold,
    color: Colors.text,
  },

  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  resendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  resendText: {
    fontSize: 16,
    fontFamily: Fonts.brandMedium,
    color: Colors.primary,
  },
});
