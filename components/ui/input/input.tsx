import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import React, { useState } from 'react';

import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type InputProps = {
  label?: string;

  required?: boolean;

  error?: string;

  leftIcon?: React.ReactNode;

  rightIcon?: React.ReactNode;

  onRightIconPress?: () => void;
} & React.ComponentProps<typeof TextInput>;

export default function Input({
  label,
  required = false,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  editable = true,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const hasError = !!error;

  const { Colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const styles = createStyles(Colors);

  return (
    <View style={styles.field}>
      {/* LABEL */}
      {label && (
        <ThemedText style={styles.label} themeColor="textSecondary">
          {label}
          {required && (
            <ThemedText style={styles.required} themeColor="error">
              {' '}
              *
            </ThemedText>
          )}
        </ThemedText>
      )}

      {/* INPUT */}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: hasError
              ? Colors.error
              : isFocused
                ? Colors.primary
                : Colors.border,
          },
          !editable && styles.disabledContainer,
        ]}
      >
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

        <TextInput
          {...props}
          editable={editable}
          value={props.value ?? ''}
          placeholderTextColor={Colors.textMuted}
          selectionColor={Colors.primary}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, style]}
        />

        {rightIcon && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <View style={styles.icon}>{rightIcon}</View>
          </TouchableOpacity>
        )}
      </View>

      {/* ERROR */}
      {hasError && (
        <ThemedText style={styles.errorText} themeColor="error">
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    field: {
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

    required: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 16,
    },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      height: 52,
      paddingHorizontal: Spacing.three,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: Colors.inputBackground,
    },

    input: {
      flex: 1,
      height: '100%',
      paddingVertical: 0,
      fontFamily: Fonts.brandRegular,
      fontSize: 15,
      color: Colors.text,
      textAlignVertical: 'center',
    },

    icon: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    disabledContainer: {
      opacity: 0.6,
    },

    errorText: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 16,
      marginTop: Spacing.one,
    },
  });
