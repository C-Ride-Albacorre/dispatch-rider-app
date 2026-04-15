import { Colors, Fonts } from '@/constants/theme';
import { useEffect, useRef, useState } from 'react';
import {
  Clipboard,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
  Pressable,
  Animated,
} from 'react-native';

const OTP_LENGTH = 5;

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
    // Allow only single digits
    const digit = value.replace(/[^0-9]/g, '').slice(-1);

    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    const otp = next.join('');
    onChange?.(otp);
    if (otp.length === OTP_LENGTH) onComplete?.(otp);

    // Advance focus
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
      const text = await Clipboard.getString();
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
              onLongPress={() => handlePaste(index)}
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
                style={styles.cellText}
                value={digit}
                onChangeText={(val) => handleChange(val, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                keyboardType="number-pad"
                maxLength={1}
                textContentType="oneTimeCode" // iOS autofill from SMS
                autoComplete="one-time-code" // Android autofill from SMS
                selectTextOnFocus
                caretHidden // hides blinking caret — cleaner UX
                autoCorrect={false}
                spellCheck={false}
              />
            </Pressable>
          );
        })}
      </Animated.View>

      {hasError ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}

const CELL_SIZE = 52;

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
    alignItems: 'center',
    width: '100%',
  },

  label: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: Fonts.brandMedium,
    alignSelf: 'flex-start',
  },

  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },

  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 12,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1.5,
    // borderColor: Colors.border,
  },

  cellFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.inputBackground,
  },

  cellFilled: {
    // borderColor: Colors.border,
  },

  cellError: {
    borderColor: '#ef4444',
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

  error: {
    fontSize: 12,
    color: '#ef4444',
    alignSelf: 'flex-start',
  },
});
