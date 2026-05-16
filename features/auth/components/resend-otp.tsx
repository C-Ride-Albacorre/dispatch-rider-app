import { Colors, Fonts } from '@/constants/theme';
import { resendOtpAction } from '@/features/verify/action';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ResendOTP({
  identifier,
  verificationToken,
  setErrorMessage,
}: {
  identifier: string | null;
  verificationToken: string | null;
  setErrorMessage: (message: string) => void;
}) {
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const handleResendOtp = async () => {
    if (!canResend || resending) return;

    if (!identifier || !verificationToken) {
      setErrorMessage('Verification session expired');
      return;
    }

    setResending(true);

    const result = await resendOtpAction(identifier);

    setResending(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Failed to resend OTP');
      return;
    }

    // restart timer
    setCountdown(30);
    setCanResend(false);
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
    <TouchableOpacity
      onPress={handleResendOtp}
      disabled={!canResend || resending}
    >
      <Text
        style={[styles.resendText, !canResend && styles.disabledResendText]}
      >
        {resending
          ? 'Resending...'
          : canResend
            ? 'Resend Code'
            : `Resend Code in ${countdown}s`}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  resendText: {
    fontSize: 16,
    fontFamily: Fonts.brandMedium,
    color: Colors.primary,
  },

  disabledResendText: {
    color: Colors.textSecondary,
  },
});
