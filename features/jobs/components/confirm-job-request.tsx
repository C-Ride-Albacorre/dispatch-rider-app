import AppModal from '@/components/layout/app-modal';
import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { saveActiveOrder } from '@/utils/token-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAcceptJob } from '../use-fetch';

export default function ConfirmRequest({
  showConfirmRequestModal,
  setShowConfirmRequestModal,
  selectedOrderId,
  // selectedOrder,
}: {
  showConfirmRequestModal: boolean;
  setShowConfirmRequestModal: (value: boolean) => void;
  selectedOrderId: string;
  // selectedOrder: any;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const { mutate: acceptJob, isPending } = useAcceptJob();

  const socket = useDriverJobsStore((s) => s.socket);
  const removeOrder = useDriverJobsStore((s) => s.removeOrder);

  const handleAccept = () => {
    if (!selectedOrderId) {
      Toast.show({
        type: 'error',
        text1: 'No order selected',
      });
      return;
    }

    acceptJob(selectedOrderId, {
      onSuccess: () => {
        setShowConfirmRequestModal(false);

        removeOrder(selectedOrderId);
        socket?.emit('order-removed', { order_id: selectedOrderId });

        void saveActiveOrder(selectedOrderId);

        Toast.show({
          type: 'success',
          text1: 'Request accepted successfully',
        });

        router.dismiss();
        router.replace('/(app)/(protected)/(tabs)/active');
      },

      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1:
            error?.response?.data?.message ||
            error?.message ||
            'Failed to accept request',
        });
      },
    });
  };

  return (
    <AppModal
      visible={showConfirmRequestModal}
      onClose={() => setShowConfirmRequestModal(false)}
      closeOnBackdropPress={!isPending}
    >
      <View style={styles.confirmRequestModal}>
        <View style={styles.confirmRequestIconWrapper}>
          <Ionicons name="bicycle-outline" size={28} color={Colors.primary} />
        </View>

        <View style={styles.textGroup}>
          <ThemedText style={styles.confirmRequestTitle}>
            Confirm Request
          </ThemedText>

          <ThemedText
            style={styles.confirmRequestDescription}
            themeColor="textSecondary"
          >
            Are you sure you want to confirm this request?
          </ThemedText>
        </View>

        <View style={styles.actionContainer}>
          <Button
            variant="outline"
            onPress={() => setShowConfirmRequestModal(false)}
            style={styles.cancelBtn}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            loading={isPending}
            disabled={isPending}
            onPress={handleAccept}
            style={styles.confirmRequestButton}
          >
            Yes, Confirm
          </Button>
        </View>
      </View>
    </AppModal>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    confirmRequestModal: {
      alignItems: 'center',
      gap: Spacing.three,
      paddingVertical: Spacing.two,
    },

    confirmRequestIconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 999,
      backgroundColor: Colors.primaryExtraLight,
      justifyContent: 'center',
      alignItems: 'center',
    },

    textGroup: {
      alignItems: 'center',
      gap: Spacing.one,
    },

    confirmRequestTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
    },

    confirmRequestDescription: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },

    actionContainer: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
      marginTop: Spacing.two,
    },

    cancelBtn: {
      flex: 1,
    },

    confirmRequestButton: {
      flex: 1,
    },
  });
