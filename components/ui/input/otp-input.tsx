import { Colors, Fonts } from '@/constants/theme';
import { useEffect, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
  Pressable,
  Animated,
} from 'react-native';

import * as Clipboard from 'expo-clipboard';
import ErrorMessage from '../error/error-message';
import { normalize, scale } from '@/utils/scaling';
import { useTheme } from '@/hooks/use-theme';

const OTP_LENGTH = 6;

interface OtpInputProps {
  label?: string;
  errorMessage?: string;
  /** Called with the full OTP string once all digits are entered */
  onComplete?: (otp: string) => void;
  /** Called on every change */
  onChange?: (otp: string) => void;
}

export default function OtpInput({
  label,
  errorMessage,
  onComplete,
  onChange,
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>(
    Array(OTP_LENGTH).fill(null),
  );
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  // Shake row when errorMessage appears
  useEffect(() => {
    if (!errorMessage) return;
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [errorMessage]);

  const handleChange = (value: string, index: number) => {
    const cleaned = value.replace(/[^0-9]/g, '');

    // 🔥 PASTE DETECTED (user pasted full OTP)
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, OTP_LENGTH);
      const next = Array(OTP_LENGTH).fill('');

      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i];
      }

      setDigits(next);

      const otp = next.join('');
      onChange?.(otp);
      if (otp.length === OTP_LENGTH) onComplete?.(otp);

      inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    // 🔥 NORMAL INPUT
    const digit = cleaned.slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    const otp = next.join('');
    onChange?.(otp);
    if (otp.length === OTP_LENGTH) onComplete?.(otp);

    // move forward
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (digits[index]) {
        // Clear current cell
        const next = [...digits];
        next[index] = '';
        setDigits(next);
        onChange?.(next.join(''));
      } else if (index > 0) {
        // Move back and clear previous
        const next = [...digits];
        next[index - 1] = '';
        setDigits(next);
        onChange?.(next.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = async (index: number) => {
    try {
      const text = (await Clipboard.getStringAsync?.()) ?? '';
      const pasted = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
      if (!pasted) return;

      const next = Array(OTP_LENGTH).fill('');
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
      setDigits(next);

      const otp = next.join('');
      onChange?.(otp);
      if (otp.length === OTP_LENGTH) onComplete?.(otp);

      // Focus last filled cell or last cell
      const focusTarget = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusTarget]?.focus();
    } catch {
      // Clipboard unavailable — ignore
    }
  };

  const hasError = !!errorMessage;

  return (
    <View style={styles.wrapper}>
      {hasError && <ErrorMessage message={errorMessage} />}

      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Animated.View
        style={[styles.row, { transform: [{ translateX: shakeAnim }] }]}
      >
        {digits.map((digit, index) => {
          const isFocused = focusedIndex === index;
          const isFilled = digit.length > 0;

          return (
            <Pressable
              key={index}
              onPress={() => inputRefs.current[index]?.focus()}
              style={[
                styles.cell,
                isFocused && styles.cellFocused,
                isFilled && !isFocused && styles.cellFilled,
                hasError && styles.cellError,
              ]}
            >
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                importantForAutofill="yes"
                style={styles.cellText}
                value={digit}
                onChangeText={(val) => handleChange(val, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                caretHidden // hides blinking caret — cleaner UX
                autoCorrect={false}
                spellCheck={false}
              />
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}

const CELL_SIZE = 52;

const createStyles = (Colors: any) =>
  StyleSheet.create({
    wrapper: {
      gap: 12,
      alignItems: 'center',
      width: '100%',
    },

    field: {
      width: '100%',
      gap: scale(6),
    },

    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(2),
    },

    label: {
      fontSize: normalize(16),
      color: Colors.text,
      fontFamily: Fonts.brandMedium,
    },

    required: {
      color: Colors.error,
      fontSize: normalize(16),
      fontFamily: Fonts.brandBold,
    },

    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: scale(8),
    },

    cell: {
      width: CELL_SIZE,
      height: CELL_SIZE,

      borderRadius: scale(12),

      backgroundColor: Colors.inputBackground,

      justifyContent: 'center',
      alignItems: 'center',

      borderWidth: 1,
      borderColor: 'transparent',
    },

    cellFocused: {
      borderColor: Colors.primary,
    },

    cellError: {
      borderColor: Colors.error,

      backgroundColor: '#FEF2F2',
    },

    cellFilled: {
      borderColor: Colors.border,
    },

      cellText: {
        fontSize: 22,
        fontFamily: Fonts.brandSemiBold ?? Fonts.brandMedium,
        color: Colors.text,
        textAlign: 'center',
        width: '100%',
        height: '100%',
        // Vertically center on Android (padding trick)
        paddingTop: 0,
        paddingBottom: 0,
        includeFontPadding: false,
      },

    input: {
      width: '100%',
      height: '100%',

      textAlign: 'center',

      color: Colors.text,

      fontSize: normalize(22),

      fontFamily: Fonts.brandSemiBold ?? Fonts.brandMedium,

      includeFontPadding: false,
      paddingVertical: 0,
    },

    errorText: {
      fontSize: normalize(13),

      color: Colors.error,

      fontFamily: Fonts.brandMedium,

      marginLeft: scale(4),
    },
  });
