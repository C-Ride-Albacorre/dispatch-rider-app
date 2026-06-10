import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { normalize, scale } from '@/utils/scaling';

import React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
  ...props
}: InputProps) {
  const hasError = !!error;

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.field}>
      {/* LABEL */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>

          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      {/* INPUT */}
      <View
        style={[
          styles.inputContainer,

          !editable && styles.disabledContainer,

          hasError && styles.errorContainer,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          {...props}
          editable={editable}
          value={props.value ?? ''}
          placeholderTextColor="#999"
          style={[styles.input, style]}
        />

        {rightIcon && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <View style={styles.iconRight}>{rightIcon}</View>
          </TouchableOpacity>
        )}
      </View>

      {/* ERROR */}
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
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
    color: '#EF4444',

    fontSize: normalize(16),

    fontFamily: Fonts.brandBold,
  },

  inputContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: Colors.inputBackground,

    borderRadius: scale(12),

    paddingHorizontal: scale(12),

    minHeight: scale(56),

    width: '100%',

    borderWidth: 1,

    borderColor: 'transparent',
  },

  input: {
    flex: 1,

    paddingVertical: scale(16),

    fontSize: normalize(16),

    fontFamily: Fonts.brandRegular,

    color: Colors.text,
  },

  iconLeft: {
    marginRight: scale(8),

    justifyContent: 'center',

    alignItems: 'center',
  },

  iconRight: {
    marginLeft: scale(8),

    justifyContent: 'center',

    alignItems: 'center',
  },

  disabledContainer: {
    opacity: 0.6,
  },

  errorContainer: {
    borderColor: '#EF4444',

    backgroundColor: '#FEF2F2',
  },

  errorText: {
    fontSize: normalize(13),

    color: '#EF4444',

    fontFamily: Fonts.brandMedium,

    marginTop: scale(2),

    marginLeft: scale(4),
  },
});
