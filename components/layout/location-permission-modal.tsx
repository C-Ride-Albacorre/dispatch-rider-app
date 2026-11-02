import { Ionicons } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';

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
            <Ionicons name="location" size={scale(36)} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Location Access</Text>

          <Text style={styles.description}>
            C-Ride uses your location to find nearby delivery jobs, match you
            with orders along your route, and share your position with
            customers during a delivery.
          </Text>

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
      backgroundColor: 'rgba(0,0,0,0.55)',
      paddingHorizontal: scale(24),
    },

    content: {
      width: '100%',
      backgroundColor: Colors.card,
      borderRadius: scale(16),
      paddingHorizontal: scale(24),
      paddingVertical: scale(32),
      alignItems: 'center',
    },

    iconWrapper: {
      width: scale(72),
      height: scale(72),
      borderRadius: scale(36),
      backgroundColor: Colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: scale(20),
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: normalize(20),
      color: Colors.text,
      textAlign: 'center',
      marginBottom: scale(10),
    },

    description: {
      fontFamily: Fonts.brandRegular,
      fontSize: normalize(14),
      color: Colors.textSecondary,
      textAlign: 'center',
      lineHeight: normalize(22),
      marginBottom: scale(28),
    },

    button: {
      width: '100%',
    },
  });
