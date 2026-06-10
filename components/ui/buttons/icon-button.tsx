import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type IconButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'outlineSecondary' | 'outlineTertiary';
  size?: 'sm' | 'md' | 'lg';
  borderRadius?: 'sm' | 'md' | 'lg' | 'full';
  notificationCount?: number;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function IconButton({
  children,
  variant = 'primary',
  size = 'md',
  borderRadius = 'full',
  disabled,
  loading,
  onPress,
  style,
  notificationCount,
}: IconButtonProps) {
  const { Colors } = useTheme();

  // Variant dependent background and border tokens
  const variantStyles = {
    primary: {
      backgroundColor: Colors.primary,
    },
    outline: {
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: 'transparent',
    },
    outlineSecondary: {
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.backgroundTertiary,
    },

    outlineTertiary: {
      borderWidth: 0,
      backgroundColor: Colors.backgroundTertiary,
    },
  };

  const loaderColor = variant === 'primary' ? Colors.white : Colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        borderRadiusStyles[borderRadius],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
    >
      {notificationCount ? (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>
            {notificationCount > 99 ? '99+' : notificationCount}
          </Text>
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator size="small" color={loaderColor} />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  disabled: {
    opacity: 0.5,
  },

  notificationBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    backgroundColor: Colors.error,
    borderRadius: scale(50),
    width: scale(15),
    height: scale(15),

    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    boxShadow: `0px 2px 2px ${Colors.shadow}`,
  },

  notificationText: {
    color: 'white',
    fontSize: normalize(8),
    fontFamily: Fonts.brandMedium,
    includeFontPadding: false,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    width: scale(36),
    height: scale(36),
  },
  md: {
    width: scale(44),
    height: scale(44),
  },
  lg: {
    width: scale(52),
    height: scale(52),
  },
});

const borderRadiusStyles = StyleSheet.create({
  sm: {
    borderRadius: scale(16) / 2,
  },
  md: {
    borderRadius: scale(24) / 2,
  },
  lg: {
    borderRadius: scale(52) / 2,
  },

  full: {
    borderRadius: scale(50),
  },
});
