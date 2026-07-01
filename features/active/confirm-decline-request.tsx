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
import { useDeclineJob } from './use-fetch';

// import { useDeclineJob } from '../jobs/use-fetch';

const DECLINE_REASONS = [
  'Too far',
  'Not enough time',
  'Not interested',
  'Other',
];

export default function ConfirmDeclineRequest({
  showConfirmDeclineModal,
  setShowConfirmDeclineModal,
  selectedOrderId,
}: {
  showConfirmDeclineModal: boolean;
  setShowConfirmDeclineModal: (value: boolean) => void;
  selectedOrderId: string;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const { mutate: declineJob, isPending } = useDeclineJob();

  const finalReason =
    selectedReason === 'Other'
      ? customReason.trim()
      : selectedReason;

  const handleDecline = () => {
    if (!selectedOrderId) {
      Toast.show({
        type: 'error',
        text1: 'No order selected',
      });

      return;
    }

    if (!selectedReason) {
      Toast.show({
        type: 'error',
        text1: 'Please select a decline reason',
      });

      return;
    }

    if (
      selectedReason === 'Other' &&
      !customReason.trim()
    ) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a custom reason',
      });

      return;
    }

    declineJob(
      {
        orderId: selectedOrderId,
        reason: finalReason,
      },
      {
        onSuccess: () => {
          setShowConfirmDeclineModal(false);

          setSelectedReason('');
          setCustomReason('');

          Toast.show({
            type: 'success',
            text1: 'Request declined successfully',
          });

          router.replace('/(app)/(protected)/(tabs)/jobs');
        },

        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1:
              error?.message ||
              'Failed to decline request',
          });
        },
      },
    );
  };

  return (
    <AppModal
      visible={showConfirmDeclineModal}
      onClose={() =>
        setShowConfirmDeclineModal(false)
      }
      closeOnBackdropPress={!isPending}
    >
      <View style={styles.confirmRequestModal}>
        <View style={styles.confirmRequestIconWrapper}>
          <Ionicons
            name="alert-circle-outline"
            size={scale(32)}
            color={Colors.error}
          />
        </View>

        <Text style={styles.confirmRequestTitle}>
          Decline Request
        </Text>

        <Text style={styles.confirmRequestDescription}>
          Why are you declining this request?
        </Text>

        <View style={styles.reasonsContainer}>
          {DECLINE_REASONS.map((item) => {
            const isSelected =
              selectedReason === item;

            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.8}
                onPress={() =>
                  setSelectedReason(item)
                }
                style={[
                  styles.reasonButton,
                  isSelected && {
                    borderColor: Colors.error,
                    backgroundColor:
                      Colors.errorLight,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.reasonText,
                    isSelected && {
                      color: Colors.error,
                      fontFamily:
                        Fonts.brandSemiBold,
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedReason === 'Other' && (
          <View style={{ width: '100%' }}>
            <Input
              placeholder="Enter custom reason"
              value={customReason}
              onChangeText={setCustomReason}
            />
          </View>
        )}

        <View style={styles.actionContainer}>
          <Button
            variant="outline"
            onPress={() =>
              setShowConfirmDeclineModal(false)
            }
            style={styles.cancelBtn}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            variant="red"
            loading={isPending}
            disabled={isPending}
            onPress={handleDecline}
            style={styles.confirmRequestButton}
          >
            Decline
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
      backgroundColor: Colors.errorLight,
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