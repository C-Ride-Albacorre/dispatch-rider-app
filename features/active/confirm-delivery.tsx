import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import AppModal from '@/components/layout/app-modal';
import Button from '@/components/ui/buttons/button';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import OtpInput from '@/components/ui/input/otp-input';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { clearActiveOrder } from '@/utils/token-storage';
import { useState } from 'react';
import { useDeliveryJob } from './use-fetch';

export default function ConfirmDelivery({
  showConfirmDeliveryModal,
  setShowConfirmDeliveryModal,
  selectedOrderId,
}: {
  showConfirmDeliveryModal: boolean;
  setShowConfirmDeliveryModal: (value: boolean) => void;
  selectedOrderId: string;
}) {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const { mutate: deliveryJob, isPending } = useDeliveryJob();

  const setActiveOrder = useDriverJobsStore((s) => s.setActiveOrder);
  const clearTracking = useDriverJobsStore((s) => s.clearTracking);

  const handleDelivery = () => {
    if (!selectedOrderId) {
      Toast.show({
        type: 'error',
        text1: 'No order selected',
      });

      return;
    }

    if (code.length !== 4) {
      setErrorMessage('Please enter the 4 digit code');

      return;
    }

    deliveryJob(
      {
        orderId: selectedOrderId,
        code: code,
      },
      {
        onSuccess: () => {
          setShowConfirmDeliveryModal(false);

          Toast.show({
            type: 'success',
            text1: 'Delivery confirmed successfully',
          });

          // Clear state after navigation starts
          setTimeout(() => {
            setActiveOrder(null);
            clearTracking();
            void clearActiveOrder();
          }, 100);

          // Navigate to jobs tab
          router.replace('/jobs');
        },

        onError: (error: any) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to confirm delivery';

          Toast.show({
            type: 'error',
            text1: errorMsg,
          });

          setErrorMessage(errorMsg);
        },
      },
    );
  };

  return (
    <AppModal
      visible={showConfirmDeliveryModal}
      onClose={() => setShowConfirmDeliveryModal(false)}
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

        <ThemedText style={styles.confirmRequestTitle}>Confirm delivery</ThemedText>

        <ThemedText
          style={styles.confirmRequestDescription}
          themeColor="textSecondary"
        >
          Kindly confirm delivery code with the customer to complete the
          delivery. This action cannot be undone.
        </ThemedText>

        <OtpInput
          OTP_LENGTH={4}
          errorMessage={errorMessage}
          onComplete={(otp) => {
            setCode(otp);
          }}
          onChange={(otp) => {
            setCode(otp);

            if (errorMessage) {
              setErrorMessage('');
            }
          }}
        />

        <View style={styles.actionContainer}>
          <Button
            variant="outline"
            size="lg"
            onPress={() => setShowConfirmDeliveryModal(false)}
            style={styles.cancelBtn}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            variant="green"
            size="lg"
            loading={isPending}
            disabled={isPending || code.length !== 4}
            onPress={handleDelivery}
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
