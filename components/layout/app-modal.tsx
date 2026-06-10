import React from 'react';

import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { scale } from '@/utils/scaling';

type AppModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdropPress?: boolean;
};

export default function AppModal({
  visible,
  onClose,
  children,
  closeOnBackdropPress = true,
}: AppModalProps) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
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

        {/* CONTENT */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(0,0,0,0.55)',
    },

    modalContainer: {
      width: '90%',
      maxWidth: scale(420),
    },

    modalContent: {
      backgroundColor: Colors.background,
      borderRadius: scale(24),
      padding: scale(24),

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.15,
      shadowRadius: scale(20),

      elevation: scale(10),
    },
  });
