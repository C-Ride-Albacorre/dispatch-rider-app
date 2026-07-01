import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AppModal from '@/components/layout/app-modal';
import Button from '@/components/ui/buttons/button';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { normalize, scale } from '@/utils/scaling';
import { useDeliveryJob, usePickupJob } from './use-fetch';
import { useDriverJobsStore } from '@/store/driver-jobs-store';

export default function ConfirmDelivery({
  showConfirmDeliveryModal,
  setShowConfirmDeliveryModal,
  selectedOrderId,
}: {
  showConfirmDeliveryModal: boolean;
  setShowConfirmDeliveryModal: (value: boolean) => void;
  selectedOrderId: string;
}) {
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

    deliveryJob(
      {
        orderId: selectedOrderId,
      },
      {
        onSuccess: () => {

          setActiveOrder(null);
          clearTracking();

          setShowConfirmDeliveryModal(false);

          Toast.show({
            type: 'success',
            text1: 'Delivery confirmed successfully',
          });

          router.replace('/(app)/(protected)/(tabs)/jobs');
        },

        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: error?.message || 'Failed to confirm delivery',
          });
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
          Are you sure you want to confirm the delivery?
        </Text>

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
            disabled={isPending}
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
