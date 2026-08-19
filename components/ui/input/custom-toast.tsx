import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp,
} from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { scale } from '@/utils/scaling';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type CustomToastProps = {
  type?: ToastType;
  title: string;
  message?: string;
};

const toastConfig = {
  success: {
    icon: 'checkmark-circle' as const,
    color: '#22C55E',
    background: '#F0FDF4',
    darkBackground: '#102A1A',
  },
  error: {
    icon: 'close-circle' as const,
    color: '#EF4444',
    background: '#FEF2F2',
    darkBackground: '#301315',
  },
  warning: {
    icon: 'warning' as const,
    color: '#F59E0B',
    background: '#FFFBEB',
    darkBackground: '#30250D',
  },
  info: {
    icon: 'information-circle' as const,
    color: '#3B82F6',
    background: '#EFF6FF',
    darkBackground: '#101F35',
  },
};

export default function CustomToast({
  type = 'success',
  title,
  message,
}: CustomToastProps) {
  const { Colors, isDark } = useTheme();

  const config = toastConfig[type];

  return (
    <Animated.View
      entering={SlideInDown.duration(350).easing(Easing.out(Easing.cubic))}
      exiting={SlideOutUp.duration(250)}
      style={[
        styles.wrapper,
        {
          backgroundColor: isDark ? config.darkBackground : config.background,
        },
      ]}
    >
      {/* Accent */}
      <View
        style={[
          styles.accent,
          {
            backgroundColor: config.color,
          },
        ]}
      />

      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: `${config.color}18`,
          },
        ]}
      >
        <Ionicons name={config.icon} size={scale(22)} color={config.color} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: Colors.text,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {!!message && (
          <Text
            style={[
              styles.message,
              {
                color: Colors.textSecondary,
              },
            ]}
            numberOfLines={2}
          >
            {message}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '92%',
    minHeight: scale(70),

    alignSelf: 'center',

    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: scale(18),

    paddingVertical: scale(12),
    paddingHorizontal: scale(14),

    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: scale(8),
    },
    shadowOpacity: 0.14,
    shadowRadius: scale(18),

    elevation: 8,
  },

  accent: {
    position: 'absolute',

    left: 0,
    top: 0,
    bottom: 0,

    width: scale(4),

 
  },

  iconContainer: {
    width: scale(42),
    height: scale(42),

    borderRadius: scale(14),

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: scale(11),
  },

  content: {
    flex: 1,
    paddingRight: scale(4),
  },

  title: {
    fontSize: scale(12),
    fontFamily: Fonts.brandSemiBold,
  },

  message: {
    marginTop: scale(3),

    fontSize: scale(12),
    lineHeight: scale(17),

    fontFamily: Fonts.brandRegular,
  },
});
