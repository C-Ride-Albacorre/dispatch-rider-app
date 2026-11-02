import AuthPageHeader from '@/components/layout/auth-header';
import SuccessModal from '@/components/layout/success-modal';
import Button from '@/components/ui/buttons/button';
import IconButton from '@/components/ui/buttons/icon-button';
import ReturnButton from '@/components/ui/buttons/return-button';
import ErrorMessage from '@/components/ui/error/error-message';
import Input from '@/components/ui/input/input';
import { ResetPasswordAction } from '@/features/auth/action';
import { ResetPasswordSchema } from '@/features/auth/schema';
import { useTheme } from '@/hooks/use-theme';
import { scale } from '@/utils/scaling';
import { clearResetToken, getResetToken } from '@/utils/token-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const goToLogin = async () => {
    await clearResetToken();

    router.replace('/(app)/(auth)/login');
  };

  const handleResetPassword = async () => {
    const result = ResetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    const token = await getResetToken();

    if (!token) {
      setError('Reset token has expired. Please request another code.');
      return;
    }

    setLoading(true);

    console.log(
      'Resetting password with token:',
      token,
      'and new password:',
      password,
    );

    const response = await ResetPasswordAction({
      token,
      newPassword: password,
    });

    setLoading(false);

    if (!response.success) {
      setError(response.message);
      return;
    }

    await clearResetToken();

    setSuccessModalVisible(true);
  };

  return (
    <>
      <SuccessModal
        title="Password Reset Successful"
        description="Your password has been updated successfully. You can now sign in using your new password."
        buttonText="Go to Login"
        path="/(app)/(auth)/login"
        showSuccessModal={successModalVisible}
        setShowSuccessModal={setSuccessModalVisible}
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
            <IconButton icon="chevron-back" size="md" variant="soft" onPress={goToLogin} accessibilityLabel="Go back" />

            <AuthPageHeader />
          </View>

          <View style={styles.form}>
            {error && <ErrorMessage message={error} />}

            <Input
              label="Password"
              placeholder="********"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError('');
              }}
              secureTextEntry={!showPassword}
              rightIcon={
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#999"
                />
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <Input
              label="Confirm Password"
              placeholder="********"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) setError('');
              }}
              secureTextEntry={!showPassword}
              rightIcon={
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#999"
                />
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
            <Button
              loading={loading}
              disabled={loading}
              onPress={handleResetPassword}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
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
    },

    returnBtn: {
      alignSelf: 'flex-start',
      padding: 8,
      borderRadius: 40,
      backgroundColor: Colors.light,
      alignItems: 'center',
      justifyContent: 'center',
    },

    container: {
      padding: scale(20),
      flexGrow: 1,
      gap: scale(24),
    },

    returnIcon: {
      color: Colors.textSecondary,
    },

    form: {
      gap: scale(24),
    },
  });
