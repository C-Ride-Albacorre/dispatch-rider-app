import AuthPageHeader from '@/components/layout/auth-header';
import Button from '@/components/ui/buttons/button';
import OtpInput from '@/components/ui/input/otp-input';
import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
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

export default function Verify() {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleVerify = (otp: string) => {
    // Placeholder verification logic
    if (otp === '123456') {
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid verification code');
    }
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
          <Text style={styles.title}>Verify your account</Text>
          <Text style={styles.subtitle}>
            We emailed you the six digit code to verify your account. Please
            enter the code below to confirm your email address.
          </Text>
        </View>

        <OtpInput
          errorMessage={errorMessage}
          onComplete={(otp) => {
            // Trigger verification automatically when all 6 digits are in
            handleVerify(otp);
          }}
          onChange={(otp) => setCode(otp)}
        />

        <Button>Verify Account</Button>

        <View style={styles.resendContainer}>
          <TouchableOpacity>
            <Text style={styles.resendText}>Resend Code</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.resendText}>Change Email</Text>
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    gap: 16,
    marginTop: 20,
  },

  resendText: {
    fontSize: 16,
    fontFamily: Fonts.brandMedium,
    color: Colors.primary,
    textAlign: 'center',
  },
});
