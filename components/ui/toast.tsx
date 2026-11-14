/**
 * C-Ride standard toast — shared, identical file in all three apps
 * (customer, merchant, dispatch). Edit it in one app, copy it to the others.
 *
 * Usage stays the stock react-native-toast-message API:
 *   Toast.show({ type: 'success' | 'error' | 'warning' | 'info', text1, text2, onPress? })
 *
 * Mount <AppToast /> once, last inside the root layout.
 */
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import Toast, { ToastConfig, ToastConfigParams } from 'react-native-toast-message';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

const ICONS = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  warning: 'warning',
  info: 'information-circle',
} as const;

const VISIBILITY_MS = 3500;

function tone(type: ToastType, Colors: any) {
  switch (type) {
    case 'success':
      return { color: Colors.success, background: Colors.successExtraLight };
    case 'error':
      return { color: Colors.error, background: Colors.errorLight };
    case 'warning':
      return { color: Colors.warning, background: Colors.warningLight };
    default:
      return { color: Colors.info, background: Colors.infoLight };
  }
}

function ToastCard({
  type,
  text1,
  text2,
  onPress,
  hide,
}: ToastConfigParams<unknown> & { type: ToastType }) {
  const { Colors } = useTheme();
  const { color, background } = tone(type, Colors);

  // Some callers only pass text2; show it as the title rather than a blank line.
  const title = text1 || text2 || '';
  const message = text1 ? text2 : undefined;

  return (
    <View style={styles.outer} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        accessibilityLabel={message ? `${title}. ${message}` : title}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: Colors.card,
            borderColor: Colors.border,
            shadowColor: Colors.black,
          },
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.icon, { backgroundColor: background }]}>
          <Ionicons name={ICONS[type]} size={20} color={color} />
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.title} numberOfLines={2}>
            {title}
          </ThemedText>

          {!!message && (
            <ThemedText
              style={styles.message}
              themeColor="textSecondary"
              numberOfLines={3}
            >
              {message}
            </ThemedText>
          )}
        </View>

        <Pressable
          onPress={() => hide()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          style={({ pressed }) => [styles.close, pressed && styles.pressed]}
        >
          <Ionicons name="close" size={18} color={Colors.textMuted} />
        </Pressable>
      </Pressable>
    </View>
  );
}

const card = (type: ToastType) => (props: ToastConfigParams<unknown>) => (
  <ToastCard {...props} type={type} />
);

export const toastConfig: ToastConfig = {
  success: card('success'),
  error: card('error'),
  warning: card('warning'),
  info: card('info'),
};

/** The app's single toast host. Sits below the status bar / notch. */
export function AppToast() {
  // Read the context directly so this still renders if mounted outside a
  // SafeAreaProvider (useSafeAreaInsets would throw there).
  const insets = useContext(SafeAreaInsetsContext);

  return (
    <Toast
      config={toastConfig}
      topOffset={(insets?.top ?? 40) + 8}
      bottomOffset={(insets?.bottom ?? 0) + 24}
      visibilityTime={VISIBILITY_MS}
    />
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  card: {
    width: '100%',
    maxWidth: 480,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },

  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    gap: 2,
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

  close: {
    padding: 4,
  },

  pressed: {
    opacity: 0.7,
  },
});
