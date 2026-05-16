import Button from '@/components/ui/buttons/button';
import { Colors, Fonts } from '@/constants/theme';
import { clearVerificationData } from '@/utils/token-storage';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Modal, Text, View } from 'react-native';

export default function ExpiredTokenModal({
  showExpiredModal,
  setShowExpiredModal,
}: {
  showExpiredModal: boolean;
  setShowExpiredModal: (value: boolean) => void;
}) {
  const router = useRouter();
  return (
    <Modal visible={showExpiredModal} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            width: '100%',
            borderRadius: 16,
            padding: 24,
            gap: 20,
          }}
        >
          <LottieView
            source={require('@/assets/lottie/alert.json')}
            autoPlay
            loop={false}
            renderMode="HARDWARE"
            style={{ width: 170, height: 170, alignSelf: 'center' }}
          />

          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.brandBold,
              color: Colors.text,
              textAlign: 'center',
            }}
          >
            Session Expired
          </Text>

          <Text
            style={{
              fontSize: 15,
              fontFamily: Fonts.brandRegular,
              color: Colors.textSecondary,
              lineHeight: 22,
              textAlign: 'center',
            }}
          >
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
