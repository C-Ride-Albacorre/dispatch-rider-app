import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  SlideInDown,
  SlideOutUp,
} from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type CustomToastProps = {
  type?: ToastType;
  title: string;
  message?: string;
};

const toastIcons = {
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'warning',
  info: 'information-circle',
} as const;

const toastTone = (type: ToastType, Colors: any) => {
  switch (type) {
    case 'error':
      return { color: Colors.error, background: Colors.errorLight };
    case 'warning':
      return { color: Colors.warning, background: Colors.warningLight };
    case 'info':
      return { color: Colors.info, background: Colors.infoLight };
    default:
      return { color: Colors.success, background: Colors.successExtraLight };
  }
};

export default function CustomToast({
  type = 'success',
  title,
  message,
}: CustomToastProps) {
  const { Colors } = useTheme();

  const tone = toastTone(type, Colors);

  return (
    <Animated.View
      entering={SlideInDown.duration(350).easing(Easing.out(Easing.cubic))}
      exiting={SlideOutUp.duration(250)}
      style={[
        styles.wrapper,
        {
          backgroundColor: Colors.card,
          borderColor: Colors.border,
          shadowColor: Colors.black,
        },
      ]}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: tone.background }]}>
        <Ionicons name={toastIcons[type]} size={20} color={tone.color} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>

        {!!message && (
          <ThemedText
            style={styles.message}
            themeColor="textSecondary"
            numberOfLines={2}
          >
            {message}
          </ThemedText>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '92%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    gap: 2,
    paddingRight: Spacing.one,
  },

  title: {
    fontFamily: Fonts.brandSemiBold,
    fontSize: 14,
    lineHeight: 20,
  },

  message: {
    fontFamily: Fonts.brandRegular,
    fontSize: 13,
    lineHeight: 18,
  },
});
