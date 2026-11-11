import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AppModal from '@/components/layout/app-modal';
import Button from '@/components/ui/buttons/button';
import Input from '@/components/ui/input/input';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

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

  const { mutateAsync: declineJob, isPending } = useDeclineJob();

  const finalReason =
    selectedReason === 'Other' ? customReason.trim() : selectedReason;

  const handleDecline = async () => {
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

    if (selectedReason === 'Other' && !customReason.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a custom reason',
      });

      return;
    }

    try {
      await declineJob({ orderId: selectedOrderId, reason: finalReason });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to decline request',
      });
      return;
    }

    setShowConfirmDeclineModal(false);
    setSelectedReason('');
    setCustomReason('');

    Toast.show({
      type: 'success',
      text1: 'Request declined successfully',
    });

    router.replace('/(app)/(protected)/(tabs)/jobs');
  };

  return (
    <AppModal
      visible={showConfirmDeclineModal}
      onClose={() => setShowConfirmDeclineModal(false)}
      closeOnBackdropPress={!isPending}
    >
      <View style={styles.confirmRequestModal}>
        <View style={styles.confirmRequestIconWrapper}>
          <Ionicons
            name="alert-circle-outline"
            size={24}
            color={Colors.error}
          />
        </View>

        <ThemedText style={styles.confirmRequestTitle}>Decline request</ThemedText>

        <ThemedText
          style={styles.confirmRequestDescription}
          themeColor="textSecondary"
        >
          Why are you declining this request?
        </ThemedText>

        <View style={styles.reasonsContainer}>
          {DECLINE_REASONS.map((item) => {
            const isSelected = selectedReason === item;

            return (
              <Pressable
                key={item}
                onPress={() => setSelectedReason(item)}
                style={({ pressed }) => [
                  styles.reasonButton,
                  isSelected && styles.reasonButtonSelected,
                  pressed && !isSelected && {
                    backgroundColor: Colors.backgroundSecondary,
                  },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <ThemedText
                  style={styles.reasonText}
                  themeColor={isSelected ? 'error' : 'text'}
                >
                  {item}
                </ThemedText>

                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={Colors.error}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        {selectedReason === 'Other' && (
          <View style={styles.customReason}>
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
            size="lg"
            onPress={() => setShowConfirmDeclineModal(false)}
            style={styles.cancelBtn}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            variant="red"
            size="lg"
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
      paddingVertical: Spacing.two,
    },

    confirmRequestIconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: Colors.errorLight,
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

    reasonsContainer: {
      width: '100%',
      gap: Spacing.two,
    },

    reasonButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.two,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 16,
      padding: 14,
      width: '100%',
      backgroundColor: Colors.card,
    },

    reasonButtonSelected: {
      borderColor: Colors.error,
      backgroundColor: Colors.errorLight,
    },

    reasonText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
    },

    customReason: {
      width: '100%',
      marginTop: 12,
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
