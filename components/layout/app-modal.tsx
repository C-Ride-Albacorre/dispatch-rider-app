
import React from 'react';

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

type ModalPosition = 'center' | 'bottom';

type ModalDimension = number | `${number}%`;

type AppModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;

  closeOnBackdropPress?: boolean;

  /**
   * Controls whether the modal content
   * receives the default padding.
   */
  isPadding?: boolean;

  /**
   * Controls where the modal appears.
   *
   * center = regular centered modal
   * bottom = bottom sheet / form sheet
   */
  position?: ModalPosition;

  /**
   * Height of the bottom sheet.
   *
   * Example:
   * height={400}
   * height="50%"
   */
  height?: ModalDimension;

  /**
   * Maximum height of the bottom sheet.
   *
   * Example:
   * maxHeight={700}
   * maxHeight="90%"
   */
  maxHeight?: ModalDimension;
};

export default function AppModal({
  visible,
  onClose,
  children,
  closeOnBackdropPress = true,
  isPadding = true,
  position = 'center',
  height,
  maxHeight,
}: AppModalProps) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const isBottom = position === 'bottom';

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isBottom ? 'slide' : 'fade'}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[
          styles.overlay,
          isBottom ? styles.bottomOverlay : styles.centerOverlay,
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* BACKDROP */}
        <TouchableWithoutFeedback
          onPress={() => {
            if (closeOnBackdropPress) {
              onClose();
            }
          }}
        >
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* MODAL */}
        <View
          style={[
            styles.modalContainer,
            isBottom
              ? [
                  styles.bottomModalContainer,

                  height !== undefined && {
                    height,
                  },

                  maxHeight !== undefined && {
                    maxHeight,
                  },
                ]
              : styles.centerModalContainer,
          ]}
        >
          {/* Prevent taps inside the modal from closing it */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={[
                styles.modalContent,

                isBottom
                  ? styles.bottomModalContent
                  : styles.centerModalContent,

                isPadding && styles.modalPadding,
              ]}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
    },

    centerOverlay: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    bottomOverlay: {
      justifyContent: 'flex-end',
    },

    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: Colors.overlay,
    },

    modalContainer: {
      overflow: 'hidden',
    },

    modalContent: {
      backgroundColor: Colors.card,
    },

    modalPadding: {
      padding: Spacing.four,
    },

    // Height comes from the children, so no flex here
    centerModalContainer: {
      width: '90%',
      maxWidth: 420,
      alignSelf: 'center',
    },

    centerModalContent: {
      borderRadius: 24,
    },

    bottomModalContainer: {
      width: '100%',
      minHeight: '50%',
      maxHeight: '90%',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
    },

    bottomModalContent: {
      flex: 1,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
    },
  });
