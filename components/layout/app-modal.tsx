
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
import { scale } from '@/utils/scaling';

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
    // =====================================
    // OVERLAY
    // =====================================

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
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },

    // =====================================
    // MODAL CONTAINER
    // =====================================

    modalContainer: {
      overflow: 'hidden',
    },

    // =====================================
    // COMMON MODAL CONTENT
    // =====================================

    modalContent: {
      backgroundColor: Colors.background,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.15,
      shadowRadius: scale(20),

      elevation: scale(10),
    },

    modalPadding: {
      padding: scale(24),
    },

    // =====================================
    // CENTER MODAL
    // =====================================

    centerModalContainer: {
      width: '90%',
      maxWidth: scale(420),
      alignSelf: 'center',

      // No height and no flex here.
      // The modal gets its height from its children.
    },

    centerModalContent: {
      borderRadius: scale(24),

      // IMPORTANT:
      // Do not use flex: 1 here.
      // Height is determined by the children.
    },

    // =====================================
    // BOTTOM SHEET
    // =====================================

    bottomModalContainer: {
      width: '100%',

      minHeight: '50%',
      maxHeight: '90%',

      borderTopLeftRadius: scale(24),
      borderTopRightRadius: scale(24),
    },

    bottomModalContent: {
      flex: 1,

      borderTopLeftRadius: scale(24),
      borderTopRightRadius: scale(24),

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -5,
      },
      shadowOpacity: 0.15,
      shadowRadius: scale(20),

      elevation: scale(10),
    },
  });
