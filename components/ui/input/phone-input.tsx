import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { useEffect, useState } from 'react';

import { Image, StyleSheet, TextInput, View } from 'react-native';

type Country = {
  name: string;
  code: string;
  dial: string;
};

const DEFAULT_COUNTRY: Country = {
  name: 'Nigeria',
  code: 'NG',
  dial: '+234',
};

interface PhoneInputProps {
  label?: string;
  required?: boolean;

  placeholder?: string;

  errorMessage?: string;

  inputInfo?: string;

  value?: string;

  onChangePhone?: (fullNumber: string) => void;
}

export default function PhoneInput({
  label = 'Phone Number',
  required = false,
  placeholder = '800 000 0000',
  onChangePhone,
  errorMessage,
  inputInfo,
  value = '',
  ...props
}: PhoneInputProps) {
  const DIAL_CODE = DEFAULT_COUNTRY.dial;

  const [localNumber, setLocalNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  useEffect(() => {
    const stripped = value.startsWith(DIAL_CODE)
      ? value.slice(DIAL_CODE.length)
      : value;

    if (stripped !== localNumber) {
      setLocalNumber(stripped);
    }
  }, [value, localNumber]);

  const hasError = !!errorMessage;

  return (
    <View style={styles.wrapper}>
      {label && (
        <ThemedText style={styles.label} themeColor="textSecondary">
          {label}
          {required && (
            <ThemedText style={styles.label} themeColor="error">
              {' '}
              *
            </ThemedText>
          )}
        </ThemedText>
      )}

      <View
        style={[
          styles.row,
          {
            borderColor: hasError
              ? Colors.error
              : isFocused
                ? Colors.primary
                : Colors.border,
          },
        ]}
      >
        <View style={styles.dialButton}>
          <Image
            source={{
              uri: 'https://flagcdn.com/w40/ng.png',
            }}
            style={styles.flag}
          />

          <ThemedText style={styles.dialCode}>{DIAL_CODE}</ThemedText>
        </View>

        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          selectionColor={Colors.primary}
          value={localNumber}
          keyboardType="phone-pad"
          autoComplete="tel"
          autoCorrect={false}
          maxLength={11}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={(text) => {
            const cleaned = text.replace(/\D/g, '').slice(0, 11);

            setLocalNumber(cleaned);
            onChangePhone?.(`${DIAL_CODE}${cleaned}`);
          }}
          {...props}
        />
      </View>

      {hasError && (
        <ThemedText style={styles.helper} themeColor="error">
          {errorMessage}
        </ThemedText>
      )}

      {inputInfo && (
        <ThemedText style={styles.helper} themeColor="textMuted">
          {inputInfo}
        </ThemedText>
      )}
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
      alignItems: 'center',
      height: 52,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      overflow: 'hidden',
      backgroundColor: Colors.inputBackground,
    },

    dialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingLeft: Spacing.three,
      paddingRight: 12,
    },

    flag: {
      width: 22,
      height: 14,
      borderRadius: 2,
    },

    dialCode: {
      fontFamily: Fonts.brandMedium,
      fontSize: 15,
      lineHeight: 20,
    },

    divider: {
      width: StyleSheet.hairlineWidth,
      height: 24,
      backgroundColor: Colors.border,
    },

    input: {
      flex: 1,
      height: '100%',
      paddingVertical: 0,
      paddingHorizontal: 12,
      fontFamily: Fonts.brandRegular,
      fontSize: 15,
      color: Colors.text,
      textAlignVertical: 'center',
    },

    helper: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 16,
      marginTop: Spacing.one,
    },
  });
