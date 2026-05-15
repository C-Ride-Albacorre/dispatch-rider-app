import { Colors, Fonts } from '@/constants/theme';
import { normalize, scale } from '@/utils/scaling';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type ButtonProps = {
  children: React.ReactNode;
  variant?:
    | 'primary'
    |'text'
    | 'outline'
    | 'ghost'
    | 'google'
    | 'green'
    | 'red'
    | 'redOutline';
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
    fontSize: normalize(16),
  },

  iconLeft: {
    marginRight: scale(8),
  },

  iconRight: {
    marginLeft: scale(8),
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
  text: {
    backgroundColor: 'transparent',
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
  text: {
    color: Colors.primary,
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
    paddingVertical: scale(10),
    paddingHorizontal: scale(14),
  },
  md: {
    paddingVertical: scale(14),
    paddingHorizontal: scale(16),
  },
  lg: {
    paddingVertical: scale(18),
    paddingHorizontal: scale(20),
  },
});

/* ROUNDED */
const roundedStyles = StyleSheet.create({
  md: {
    borderRadius: scale(8),
  },
  lg: {
    borderRadius: scale(12),
  },
  full: {
    borderRadius: 999,
  },
});
