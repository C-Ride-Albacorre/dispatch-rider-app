import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import AppModal from '@/components/layout/app-modal';
import Button from '@/components/ui/buttons/button';

import { scale } from '@/utils/scaling';

import { useDeleteAccount } from '../../use-fetch';
import { DELETE_ACCOUNT_STEPS, DELETE_CONFIRMATION_PHRASE } from './data';
import DeleteConfirmStep from './delete-confirm-step';
import DeleteConsequencesStep from './delete-consequences-step';
import DeleteReasonStep from './delete-reason-step';
import DeleteStepIndicator from './delete-step-indicator';

export default function DeleteAccountModal({
  showDeleteModal,
  setShowDeleteModal,
}: {
  showDeleteModal: boolean;
  setShowDeleteModal: (value: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [confirmationText, setConfirmationText] = useState('');

  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  // Fixed height so the modal doesn't jump between steps;
  // the step content scrolls inside it.
  const { height: windowHeight } = useWindowDimensions();
  const modalHeight = Math.min(windowHeight * 0.75, scale(580));

  const finalReason =
    selectedReason === 'Other' ? customReason.trim() : selectedReason;

  const isConfirmed =
    confirmationText.trim().toLowerCase() === DELETE_CONFIRMATION_PHRASE;

  const handleClose = () => {
    if (isPending) return;

    setShowDeleteModal(false);

    setStep(1);
    setSelectedReason('');
    setCustomReason('');
    setConfirmationText('');
  };

  const handleReasonContinue = () => {
    if (!selectedReason) {
      Toast.show({
        type: 'error',
        text1: 'Please select a reason',
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

    setStep(3);
  };

  const handleDelete = () => {
    if (!isConfirmed) {
      Toast.show({
        type: 'error',
        text1: `Please type "${DELETE_CONFIRMATION_PHRASE}" to confirm`,
      });

      return;
    }

    deleteAccount(
      { reason: finalReason },
      {
        onSuccess: () => {
          handleClose();

          Toast.show({
            type: 'success',
            text1: 'Account deleted successfully',
          });
        },

        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1:
              error?.response?.data?.message ||
              error?.message ||
              'Failed to delete account',
          });
        },
      },
    );
  };

  return (
    <AppModal
      visible={showDeleteModal}
      onClose={handleClose}
      closeOnBackdropPress={!isPending}
    >
      <View style={[styles.container, { height: modalHeight }]}>
        <DeleteStepIndicator
          current={step}
          total={DELETE_ACCOUNT_STEPS}
          onClose={handleClose}
          disabled={isPending}
        />

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && <DeleteConsequencesStep />}

          {step === 2 && (
            <DeleteReasonStep
              selectedReason={selectedReason}
              setSelectedReason={setSelectedReason}
              customReason={customReason}
              setCustomReason={setCustomReason}
            />
          )}

          {step === 3 && (
            <DeleteConfirmStep
              confirmationText={confirmationText}
              setConfirmationText={setConfirmationText}
            />
          )}
        </ScrollView>

        <View style={styles.actionContainer}>
          <Button
            variant="outline"
            onPress={step === 1 ? handleClose : () => setStep(step - 1)}
            style={styles.actionButton}
            disabled={isPending}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>

          {step === 1 && (
            <Button
              variant="red"
              onPress={() => setStep(2)}
              style={styles.actionButton}
            >
              Continue
            </Button>
          )}

          {step === 2 && (
            <Button
              variant="red"
              onPress={handleReasonContinue}
              style={styles.actionButton}
            >
              Continue
            </Button>
          )}

          {step === 3 && (
            <Button
              variant="red"
              loading={isPending}
              disabled={!isConfirmed || isPending}
              onPress={handleDelete}
              style={styles.actionButton}
            >
              Delete Account
            </Button>
          )}
        </View>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  body: {
    flex: 1,
  },

  bodyContent: {
    alignItems: 'center',
    paddingBottom: scale(8),
  },

  actionContainer: {
    flexDirection: 'row',
    gap: scale(12),
    width: '100%',
    paddingTop: scale(16),
  },

  actionButton: {
    flex: 1,
  },
});
