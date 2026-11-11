import { Ionicons } from '@expo/vector-icons';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BackgroundLocationModalProps = {
  visible: boolean;
  onContinue: () => void;
  onDismiss: () => void;
};

export default function BackgroundLocationModal({
  visible,
  onContinue,
  onDismiss,
}: BackgroundLocationModalProps) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const settingLabel =
    Platform.OS === 'ios' ? '“Always”' : '“Allow all the time”';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <Ionicons name="navigate-outline" size={24} color={Colors.primary} />
          </View>

          <View style={styles.text}>
            <ThemedText style={styles.title}>
              Share location while online
            </ThemedText>

            <ThemedText style={styles.description} themeColor="textSecondary">
              C-Ride Driver collects your location while you are online, even
              when the app is closed or not in use. This lets us send you
              nearby jobs and show customers where their delivery is.
            </ThemedText>

            <ThemedText style={styles.description} themeColor="textSecondary">
              Location sharing stops as soon as you go offline. On the next
              screen, choose {settingLabel}.
            </ThemedText>
          </View>

          <Button onPress={onContinue} style={styles.button}>
            Continue
          </Button>

          <Pressable onPress={onDismiss} hitSlop={8}>
            <ThemedText style={styles.secondary} themeColor="textSecondary">
              Not now
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.overlay,
      paddingHorizontal: Spacing.four,
    },

    content: {
      width: '100%',
      maxWidth: 420,
      alignItems: 'center',
      gap: Spacing.four,
      padding: Spacing.four,
      borderRadius: 24,
      backgroundColor: Colors.card,
    },

    iconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: Colors.primaryExtraLight,
      justifyContent: 'center',
      alignItems: 'center',
    },

    text: {
      gap: Spacing.two,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
      textAlign: 'center',
    },

    description: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },

    button: {
      width: '100%',
    },

    secondary: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
    },
  });
