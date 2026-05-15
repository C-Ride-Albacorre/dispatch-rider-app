import Button from '@/components/ui/buttons/button';
import { Colors, Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';
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
          <Text
            style={{
              fontSize: 20,
              fontFamily: Fonts.brandBold,
              color: Colors.text,
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
            }}
          >
            Your verification session has expired. Please login again to
            continue.
          </Text>

          <Button
            onPress={() => {
              setShowExpiredModal(false);

              router.replace('/(auth)/login');
            }}
          >
            Go to Login
          </Button>
        </View>
      </View>
    </Modal>
  );
}
