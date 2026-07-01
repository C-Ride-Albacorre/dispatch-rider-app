import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AppModal from '@/components/layout/app-modal';
import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { normalize, scale } from '@/utils/scaling';
import { useDeclineJob, usePickupJob } from './use-fetch';



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
            text1: error?.message || 'Failed to decline request',
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
            size={scale(32)}
            color={Colors.success}
          />
        </View>

        <Text style={styles.confirmRequestTitle}>Confirm Pickup</Text>

        <Text style={styles.confirmRequestDescription}>
          Are you sure you want to confirm the pickup?
        </Text>

        <View style={styles.actionContainer}>
          <Button
            variant="outline"
            onPress={() => setShowConfirmPickupModal(false)}
            style={styles.cancelBtn}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            variant="green"
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
