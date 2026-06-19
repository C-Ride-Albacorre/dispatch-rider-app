import AppModal from '@/components/layout/app-modal';
import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { act, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAcceptJob } from '../use-fetch';
import Toast from 'react-native-toast-message';

export default function ConfirmRequest({
  showConfirmRequestModal,
  setShowConfirmRequestModal,
  selectedOrderId,
}: {
  showConfirmRequestModal: boolean;
  setShowConfirmRequestModal: (value: boolean) => void;
  selectedOrderId: string;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const { mutate: acceptJob, isPending } = useAcceptJob();

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

        Toast.show({
          type: 'success',
          text1: 'Request accepted successfully',
        });
      },

      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: error?.message || 'Failed to accept request',
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
          <Ionicons
            name="bicycle-outline"
            size={scale(32)}
            color={Colors.primary}
          />
        </View>

        <Text style={styles.confirmRequestTitle}>Confirm Request</Text>

        <Text style={styles.confirmRequestDescription}>
          Are you sure you want to confirm this request?
        </Text>

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
      paddingVertical: scale(8),
    },

    confirmRequestIconWrapper: {
      width: scale(64),
      height: scale(64),
      borderRadius: scale(32),
      backgroundColor: Colors.primaryLight,
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
      marginBottom: scale(24),
    },

    actionContainer: {
      flexDirection: 'row',
      gap: scale(12),
      width: '100%',
    },

    cancelBtn: {
      flex: 1,
    },
    confirmRequestButton: {
      flex: 1,
    },
  });
