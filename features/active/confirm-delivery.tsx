import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import AppModal from '@/components/layout/app-modal';
import Button from '@/components/ui/buttons/button';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import OtpInput from '@/components/ui/input/otp-input';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { normalize, scale } from '@/utils/scaling';
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
            size={scale(32)}
            color={Colors.success}
          />
        </View>

        <Text style={styles.confirmRequestTitle}>Confirm Delivery</Text>

        <Text style={styles.confirmRequestDescription}>
          Kindly confirm delivery code with the customer to complete the
          delivery. This action cannot be undone.
        </Text>

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
            onPress={() => setShowConfirmDeliveryModal(false)}
            style={styles.cancelBtn}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            variant="green"
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
      paddingVertical: scale(8),
    },

    confirmRequestIconWrapper: {
      width: scale(64),
      height: scale(64),
      borderRadius: scale(32),
      backgroundColor: Colors.successExtraLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: scale(16),
    },

    confirmRequestTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: normalize(18),
      color: Colors.text,
      marginBottom: scale(8),
    },

    confirmRequestDescription: {
      fontFamily: Fonts.brandRegular,
      fontSize: normalize(13),
      color: Colors.textSecondary,
      textAlign: 'center',
      lineHeight: normalize(20),
      marginBottom: scale(20),
    },

    reasonsContainer: {
      width: '100%',
      gap: scale(10),
      marginBottom: scale(20),
    },

    reasonButton: {
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: scale(12),
      paddingVertical: scale(14),
      paddingHorizontal: scale(14),
      width: '100%',
    },

    reasonText: {
      fontFamily: Fonts.brandRegular,
      fontSize: normalize(13),
      color: Colors.text,
    },

    actionContainer: {
      flexDirection: 'row',
      gap: scale(12),
      width: '100%',
      marginTop: scale(20),
    },

    cancelBtn: {
      flex: 1,
    },

    confirmRequestButton: {
      flex: 1,
    },
  });
