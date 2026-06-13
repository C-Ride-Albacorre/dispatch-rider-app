import { Ionicons } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';

type NotificationPermissionModalProps = {
  visible: boolean;
  onAllow: () => void;
  onDeny: () => void;
};

export default function NotificationPermissionModal({
  visible,
  onAllow,
  onDeny,
}: NotificationPermissionModalProps) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <Ionicons
              name="notifications"
              size={scale(36)}
              color={Colors.success}
            />
          </View>

          <Text style={styles.title}>Stay in the loop</Text>

          <Text style={styles.description}>
            Allow notifications so you never miss a ride request, delivery
            update, or important alert from dispatch.
          </Text>

          <Button onPress={onAllow} style={styles.button}>
            Allow Notifications
          </Button>

          <Button
            variant="outline"
            onPress={onDeny}
            style={StyleSheet.flatten([styles.button, styles.denyButton])}
          >
            Not Now
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
      backgroundColor: Colors.successExtraLight,
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

    denyButton: {
      marginTop: scale(12),
    },
  });
