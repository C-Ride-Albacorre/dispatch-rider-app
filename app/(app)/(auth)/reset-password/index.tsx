import SuccessModal from '@/components/layout/success-modal';
import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';
import { Spacing } from '@/constants/theme';
import { ResetPasswordAction } from '@/features/auth/action';
import AuthScreen, { FormError } from '@/features/auth/components/auth-screen';
import { ResetPasswordSchema } from '@/features/auth/schema';
import { useTheme } from '@/hooks/use-theme';
import { clearResetToken, getResetToken } from '@/utils/token-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const { Colors } = useTheme();

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

      <AuthScreen
        title="Set a new password"
        subtitle="Choose a new password for your account."
        onBack={goToLogin}
      >
        <View style={styles.form}>
          <FormError message={error} />

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
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={Colors.textMuted}
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
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={Colors.textMuted}
              />
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
        </View>

        <Button
          size="lg"
          loading={loading}
          disabled={loading}
          onPress={handleResetPassword}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </AuthScreen>
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
});
