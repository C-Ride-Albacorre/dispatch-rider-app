import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useEffect, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
  Pressable,
  Animated,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';

interface OtpInputProps {
  label?: string;
  errorMessage?: string;
  OTP_LENGTH?: number;

  onComplete?: (otp: string) => void;

  onChange?: (otp: string) => void;
}

export default function OtpInput({
  label,
  errorMessage,
  onComplete,
  onChange,
  OTP_LENGTH = 6,
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const inputRefs = useRef<Array<TextInput | null>>(
    Array(OTP_LENGTH).fill(null),
  );

  const autofillRef = useRef<TextInput | null>(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const fillOtp = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, OTP_LENGTH);

    if (!cleaned) {
      return;
    }

    const next = Array(OTP_LENGTH).fill('');

    for (let i = 0; i < cleaned.length; i++) {
      next[i] = cleaned[i];
    }

    setDigits(next);

    const otp = next.join('');

    onChange?.(otp);

    if (cleaned.length === OTP_LENGTH) {
      onComplete?.(otp);
    }
  };

  const handleChange = (value: string, index: number) => {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length > 1) {
      fillOtp(cleaned);
      return;
    }

    const digit = cleaned.slice(-1);

    const next = [...digits];

    next[index] = digit;

    setDigits(next);

    const otp = next.join('');

    onChange?.(otp);

    if (otp.length === OTP_LENGTH) {
      onComplete?.(otp);
      return;
    }

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key !== 'Backspace') {
      return;
    }

    if (digits[index]) {
      const next = [...digits];

      next[index] = '';

      setDigits(next);

      onChange?.(next.join(''));

      return;
    }

    if (index > 0) {
      const next = [...digits];

      next[index - 1] = '';

      setDigits(next);

      onChange?.(next.join(''));

      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

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
  }, [errorMessage, shakeAnim]);

  const hasError = !!errorMessage;

  return (
    <View style={styles.wrapper}>
      {label && (
        <ThemedText style={styles.label} themeColor="textSecondary">
          {label}
        </ThemedText>
      )}

      {/**
       * ==================================================
       * HIDDEN OTP AUTOFILL INPUT
       * ==================================================
       */}
      <TextInput
        ref={autofillRef}
        onChangeText={(value) => {
          const cleaned = value.replace(/\D/g, '');

          if (cleaned.length > 0) {
            fillOtp(cleaned);
          }
        }}
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        importantForAutofill="yes"
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        style={styles.autofillInput}
        caretHidden
        autoCorrect={false}
        spellCheck={false}
      />

      {hasError && (
        <ThemedText style={styles.errorPill} themeColor="error">
          {errorMessage}
        </ThemedText>
      )}

      {/**
       * ==================================================
       * VISIBLE OTP INPUTS
       * ==================================================
       */}
      <Animated.View
        style={[
          styles.row,
          {
            transform: [
              {
                translateX: shakeAnim,
              },
            ],
          },
        ]}
      >
        {digits.map((digit, index) => {
          const isFocused = focusedIndex === index;

          const isFilled = digit.length > 0;

          return (
            <Pressable
              key={index}
              onPress={() => {
                inputRefs.current[index]?.focus();
              }}
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
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                caretHidden
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

const createStyles = (Colors: any) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
    },

    label: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: Spacing.two,
    },

    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: Spacing.two,
    },

    cell: {
      flex: 1,
      maxWidth: 56,
      aspectRatio: 1,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
      backgroundColor: Colors.inputBackground,
    },

    cellFocused: {
      borderWidth: 1.5,
      borderColor: Colors.primary,
    },

    cellFilled: {
      borderColor: Colors.border,
    },

    cellError: {
      borderColor: Colors.error,
      backgroundColor: Colors.errorLight,
    },

    cellText: {
      width: '100%',
      height: '100%',
      fontFamily: Fonts.brandSemiBold,
      fontSize: 22,
      color: Colors.text,
      textAlign: 'center',
      paddingTop: 0,
      paddingBottom: 0,
      includeFontPadding: false,
    },

    autofillInput: {
      position: 'absolute',
      width: 1,
      height: 1,
      opacity: 0,
    },

    errorPill: {
      alignSelf: 'center',
      marginBottom: Spacing.three,
      paddingVertical: 6,
      paddingHorizontal: Spacing.three,
      borderRadius: 999,
      overflow: 'hidden',
      backgroundColor: Colors.errorLight,
      textAlign: 'center',
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 16,
    },
  });
