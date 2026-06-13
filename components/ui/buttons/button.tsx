import { useTheme } from '@/hooks/use-theme';
import { Fonts } from '@/constants/theme';
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
    | 'text'
    | 'outline'
    | 'ghost'
    | 'white'
    | 'whiteOutline'
    | 'google'
    | 'green'
    | 'red'
    | 'redOutline'
    | 'inverted';
    
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
  rounded = 'md',
  disabled,
  loading,
  onPress,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const { Colors, isDark } = useTheme();

  const variantStyles = {
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

    white: {
      backgroundColor: Colors.white,
    },

    whiteOutline: {
      borderWidth: 1,
      borderColor: Colors.white,
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
      backgroundColor: isDark ? Colors.errorLight : Colors.error + '1A',
    },

    inverted: {
      backgroundColor: Colors.text,
    },
  };

  const textVariantStyles = {
    primary: {
      color: isDark ? '#1A1A1A' : Colors.text,
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

    white: {
      color: Colors.black,
    },

    whiteOutline: {
      color: Colors.white,
    },

    google: {
      color: Colors.white,
    },

    green: {
      color: Colors.white,
    },

    red: {
      color: Colors.white,
    },

    redOutline: {
      color: Colors.error,
    },

    inverted: {
      color: Colors.background,
    },
  };

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
      activeOpacity={0.85}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
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
