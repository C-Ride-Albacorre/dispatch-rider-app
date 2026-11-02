import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { clearVerificationData } from '@/utils/token-storage';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Modal, StyleSheet, View } from 'react-native';

export default function ExpiredTokenModal({
  showExpiredModal,
  setShowExpiredModal,
}: {
  showExpiredModal: boolean;
  setShowExpiredModal: (value: boolean) => void;
}) {
  const router = useRouter();

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <Modal visible={showExpiredModal} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <LottieView
            source={require('@/assets/lottie/alert.json')}
            autoPlay
            loop={false}
            renderMode="HARDWARE"
            style={styles.animation}
          />

          <View style={styles.text}>
            <ThemedText style={styles.title}>Session Expired</ThemedText>

            <ThemedText style={styles.description} themeColor="textMuted">
              Your verification session has expired. Please login again to
              continue.
            </ThemedText>
          </View>

          <Button
            size="lg"
            onPress={() => {
              setShowExpiredModal(false);

              clearVerificationData();

              router.replace('/(app)/(auth)/login');
            }}
          >
            Go to Login
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
      backgroundColor: Colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.three,
    },

    content: {
      backgroundColor: Colors.card,
      borderWidth: 1,
      borderColor: Colors.border,
      width: '100%',
      borderRadius: 24,
      padding: Spacing.four,
      gap: Spacing.four,
    },

    animation: {
      width: 140,
      height: 140,
      alignSelf: 'center',
    },

    text: {
      gap: Spacing.one,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      textAlign: 'center',
    },

    description: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },
  });
