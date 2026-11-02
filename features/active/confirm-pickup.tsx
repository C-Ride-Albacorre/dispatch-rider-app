import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

import AppModal from '@/components/layout/app-modal';
import Button from '@/components/ui/buttons/button';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { usePickupJob } from './use-fetch';

export default function ConfirmPickup({
  showConfirmPickupModal,
  setShowConfirmPickupModal,
  selectedOrderId,
}: {
  showConfirmPickupModal: boolean;
  setShowConfirmPickupModal: (value: boolean) => void;
  selectedOrderId: string;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const { mutate: pickupJob, isPending } = usePickupJob();

  const handlePickup = () => {
    if (!selectedOrderId) {
      Toast.show({
        type: 'error',
        text1: 'No order selected',
      });

      return;
    }

    pickupJob(
      {
        orderId: selectedOrderId,
      },
      {
        onSuccess: () => {
          setShowConfirmPickupModal(false);

          Toast.show({
            type: 'success',
            text1: 'Pickup confirmed successfully',
          });

          // router.replace('/(app)/(protected)/(tabs)/jobs');
        },

        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1:
              error?.response?.data?.message ||
              error?.message ||
              'Failed to confirm pickup',
          });
        },
      },
    );
  };

  return (
    <AppModal
      visible={showConfirmPickupModal}
      onClose={() => setShowConfirmPickupModal(false)}
      closeOnBackdropPress={!isPending}
    >
      <View style={styles.confirmRequestModal}>
        <View style={styles.confirmRequestIconWrapper}>
          <Ionicons
            name="cube-outline"
            size={24}
            color={Colors.success}
          />
        </View>

        <ThemedText style={styles.confirmRequestTitle}>Confirm pickup</ThemedText>

        <ThemedText
          style={styles.confirmRequestDescription}
          themeColor="textSecondary"
        >
          Are you sure you want to confirm the pickup?
        </ThemedText>

        <View style={styles.actionContainer}>
          <Button
            variant="outline"
            size="lg"
            onPress={() => setShowConfirmPickupModal(false)}
            style={styles.cancelBtn}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            variant="green"
            size="lg"
            loading={isPending}
            disabled={isPending}
            onPress={handlePickup}
            style={styles.confirmRequestButton}
          >
            Confirm
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
      paddingVertical: Spacing.two,
    },

    confirmRequestIconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: Colors.successExtraLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.three,
    },

    confirmRequestTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
      marginBottom: Spacing.one,
    },

    confirmRequestDescription: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      marginBottom: Spacing.four,
    },

    actionContainer: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
      marginTop: Spacing.four,
    },

    cancelBtn: {
      flex: 1,
    },

    confirmRequestButton: {
      flex: 1,
    },
  });
