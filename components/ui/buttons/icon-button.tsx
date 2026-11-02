import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';

import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

type IconName = keyof typeof Ionicons.glyphMap;

type IconButtonProps = {
  icon: IconName;
  variant?:
    | 'primary'
    | 'secondary'
    | 'soft'
    | 'glass'
    | 'inverted'
    | 'ghost'
    | 'red'
    | 'redSecondary';
  size?: 'sm' | 'md' | 'lg';
  iconSize?: number;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  /** Red count badge on the corner, e.g. unread notifications */
  notificationCount?: number;
};

export default function IconButton({
  icon,
  variant = 'soft',
  size = 'sm',
  iconSize,
  disabled,
  loading,
  onPress,
  style,
  accessibilityLabel,
  notificationCount,
}: IconButtonProps) {
  const { Colors, isDark } = useTheme();

  const variantStyles: Record<NonNullable<IconButtonProps['variant']>, ViewStyle> = {
    primary: {
      backgroundColor: Colors.primary,
    },

    secondary: {
      backgroundColor: Colors.backgroundSecondary,
    },

    soft: {
      backgroundColor: Colors.inputBackground,
    },

    glass: {
      backgroundColor: Colors.glass,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.glassBorder,
    },

    inverted: {
      backgroundColor: Colors.text,
    },

    ghost: {
      backgroundColor: 'transparent',
    },

    red: {
      backgroundColor: Colors.error,
    },

    redSecondary: {
      backgroundColor: isDark ? Colors.errorLight : Colors.error + '1A',
    },
  };

  const iconColors: Record<NonNullable<IconButtonProps['variant']>, string> = {
    primary: Colors.onPrimary,
    secondary: Colors.textSecondary,
    soft: Colors.text,
    glass: Colors.white,
    inverted: Colors.background,
    ghost: Colors.text,
    red: Colors.white,
    redSecondary: Colors.error,
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColors[variant]} />
      ) : (
        <Ionicons
          name={icon}
          size={iconSize ?? iconSizes[size]}
          color={iconColors[variant]}
        />
      )}

      {!!notificationCount && (
        <View style={[styles.badge, { backgroundColor: Colors.error, borderColor: Colors.card }]}>
          <Text style={[styles.badgeText, { color: Colors.white }]}>
            {notificationCount > 99 ? '99+' : notificationCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const iconSizes = {
  sm: 16,
  md: 18,
  lg: 20,
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },

  disabled: {
    opacity: 0.5,
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    fontFamily: Fonts.brandMedium,
    fontSize: 9,
    lineHeight: 12,
    includeFontPadding: false,
  },

  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    width: 34,
    height: 34,
  },

  md: {
    width: 40,
    height: 40,
  },

  lg: {
    width: 48,
    height: 48,
  },
});
