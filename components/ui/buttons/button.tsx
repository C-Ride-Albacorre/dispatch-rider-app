import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
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
    | 'redSecondary'
    | 'redOutline'
    | 'inverted'
    | 'chip'
    | 'chipActive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: 'md' | 'lg' | 'full';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  disabled,
  loading,
  onPress,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const { Colors, isDark } = useTheme();

  const variantStyles: Record<NonNullable<ButtonProps['variant']>, ViewStyle> = {
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

       redSecondary: {
      backgroundColor: isDark ? Colors.errorLight : Colors.error + '1A',
    },

    redOutline: {
      borderWidth: 1,
      borderColor: Colors.error,
      backgroundColor: isDark ? Colors.errorLight : Colors.error + '1A',
    },

    inverted: {
      backgroundColor: Colors.text,
    },

    chip: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
      backgroundColor: Colors.inputBackground,
    },

    chipActive: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.primary,
      backgroundColor: Colors.primary,
    },
  };

  const textColors: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: Colors.onPrimary,
    text: Colors.primary,
    outline: Colors.text,
    ghost: Colors.primary,
    white: Colors.black,
    whiteOutline: Colors.white,
    google: Colors.white,
    green: Colors.white,
    red: Colors.white,
    redSecondary: Colors.error,
    redOutline: Colors.error,
    inverted: Colors.background,
    chip: Colors.textSecondary,
    chipActive: Colors.onPrimary,
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <View style={[styles.content, contentGapStyles[size]]}>
          {leftIcon}

          <Text
            style={[
              styles.text,
              textSizeStyles[size],
              { color: textColors[variant] },
              textStyle,
            ]}
          >
            {children}
          </Text>

          {rightIcon}
        </View>
      )}
    </Pressable>
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
    fontFamily: Fonts.brandSemiBold,
  },

  disabled: {
    opacity: 0.5,
  },

  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});

const sizeStyles = StyleSheet.create({
  xs: {
    height: 34,
    paddingHorizontal: Spacing.three,
  },

  sm: {
    height: 44,
    paddingHorizontal: Spacing.three,
  },

  md: {
    height: 52,
    paddingHorizontal: Spacing.four,
  },

  lg: {
    height: 56,
    paddingHorizontal: Spacing.four,
  },
});

const textSizeStyles = StyleSheet.create({
  xs: {
    fontFamily: Fonts.brandMedium,
    fontSize: 13,
    lineHeight: 18,
  },

  sm: {
    fontSize: 13,
    lineHeight: 18,
  },

  md: {
    fontSize: 14,
    lineHeight: 20,
  },

  lg: {
    fontSize: 15,
    lineHeight: 20,
  },
});

const contentGapStyles = StyleSheet.create({
  xs: {
    gap: 6,
  },

  sm: {
    gap: Spacing.two,
  },

  md: {
    gap: 10,
  },

  lg: {
    gap: 10,
  },
});

const roundedStyles = StyleSheet.create({
  md: {
    borderRadius: 12,
  },

  lg: {
    borderRadius: 12,
  },

  full: {
    borderRadius: 999,
  },
});
