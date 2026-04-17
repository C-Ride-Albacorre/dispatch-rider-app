import { Colors, Fonts } from '@/constants/theme';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'google' | 'green'| 'red' | 'redOutline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'md' | 'lg' | 'full';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'lg',
  disabled,
  loading,
  onPress,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

          <Text style={[styles.text, textVariantStyles[variant], textStyle]}>
            {children}
          </Text>

          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontFamily: Fonts.brandMedium,
    fontSize: 16,
  },

  iconLeft: {
    marginRight: 8,
  },

  iconRight: {
    marginLeft: 8,
  },

  disabled: {
    opacity: 0.5,
  },
});

/* VARIANTS */
const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: Colors.primary,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  google: {
    backgroundColor: Colors.googleBlue,
  },
  green: {
    backgroundColor: Colors.success,
  },
  red: {
    backgroundColor: Colors.error,
  },
  redOutline: {
    borderWidth: 1,
    borderColor: Colors.error,
    backgroundColor: Colors.error + '1A', // 10% opacity
  },
});

const textVariantStyles = StyleSheet.create({
  primary: {
    color: Colors.text,
  },
  outline: {
    color: Colors.text,
  },
  ghost: {
    color: Colors.primary,
  },
  google: {
    color: Colors.text,
  },
  green: {
    color: Colors.text,
  },
  red: {
    color: Colors.text,
  },
  redOutline: {
    color: Colors.error,
  },

});

/* SIZES */
const sizeStyles = StyleSheet.create({
  sm: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  md: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  lg: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
});

/* ROUNDED */
const roundedStyles = StyleSheet.create({
  md: {
    borderRadius: 8,
  },
  lg: {
    borderRadius: 12,
  },
  full: {
    borderRadius: 999,
  },
});
