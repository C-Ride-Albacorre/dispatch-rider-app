import { Ionicons } from '@expo/vector-icons';
import { Modal, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type LocationPermissionModalProps = {
  visible: boolean;
  onContinue: () => void;
};

export default function LocationPermissionModal({
  visible,
  onContinue,
}: LocationPermissionModalProps) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onContinue}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <Ionicons name="location-outline" size={24} color={Colors.primary} />
          </View>

          <View style={styles.text}>
            <ThemedText style={styles.title}>Location access</ThemedText>

            <ThemedText style={styles.description} themeColor="textSecondary">
              C-Ride uses your location to find nearby delivery jobs, match you
              with orders along your route, and share your position with
              customers during a delivery.
            </ThemedText>
          </View>

          <Button onPress={onContinue} style={styles.button}>
            Continue
          </Button>
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
  });
