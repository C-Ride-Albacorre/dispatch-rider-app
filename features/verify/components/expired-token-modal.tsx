import Button from '@/components/ui/buttons/button';
import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { clearVerificationData } from '@/utils/token-storage';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import { Modal, Text, View } from 'react-native';

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

          <Text style={styles.title}>Session Expired</Text>

          <Text style={styles.description}>
            Your verification session has expired. Please login again to
            continue.
          </Text>

          <Button
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
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(20),
    },

    content: {
      backgroundColor: Colors.background,
      width: '100%',
      borderRadius: scale(16),
      padding: scale(24),
      gap: scale(20),
    },
    animation: {
      width: scale(170),
      height: scale(170),
      alignSelf: 'center',
    },

    title: {
      fontSize: normalize(20),
      fontFamily: Fonts.brandBold,
      color: Colors.text,
      textAlign: 'center',
    },
    description: {
      fontSize: normalize(15),
      fontFamily: Fonts.brandRegular,
      color: Colors.textSecondary,
      lineHeight: normalize(22),
      textAlign: 'center',
    },
  });
