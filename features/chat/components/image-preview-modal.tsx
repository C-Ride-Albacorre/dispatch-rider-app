import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
  visible: boolean;
  imageUri: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function ImagePreviewModal({
  visible,
  imageUri,
  onConfirm,
  onCancel,
  isLoading = false,
}: Props) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          setImageSize({ width, height });
        },
        () => {
          setImageSize(null);
        },
      );
    }
  }, [imageUri]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Preview Image</Text>
            <Pressable
              onPress={onCancel}
              disabled={isLoading}
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="close" size={24} color={Colors.text} />
            </Pressable>
          </View>

          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <ActivityIndicator size="large" color={Colors.primary} />
            )}
          </View>

          {imageSize && (
            <Text style={styles.sizeText}>
              {Math.round(imageSize.width)} × {Math.round(imageSize.height)} px
            </Text>
          )}

          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && !isLoading && { opacity: 0.9 },
                isLoading && styles.confirmDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="send" size={18} color={Colors.text}/>
                  <Text style={styles.confirmText}>Send</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(16),
    },
    container: {
      width: '100%',
      maxHeight: '85%',
      backgroundColor: Colors.background,
      borderRadius: scale(16),
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: scale(16),
      paddingVertical: scale(16),
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    title: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },
    imageContainer: {
      width: '100%',
      height: scale(300),
      backgroundColor: Colors.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    sizeText: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandRegular,
      color: Colors.textSecondary,
      textAlign: 'center',
      paddingVertical: scale(12),
    },
    actions: {
      flexDirection: 'row',
      gap: scale(12),
      paddingHorizontal: scale(16),
      paddingVertical: scale(16),
      borderTopWidth: 1,
      borderTopColor: Colors.border,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: scale(12),
      borderRadius: scale(8),
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelText: {
      fontSize: normalize(15),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
    },
    confirmButton: {
      flex: 1,
      paddingVertical: scale(12),
      borderRadius: scale(8),
      backgroundColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: scale(6),
    },
    confirmDisabled: {
      opacity: 0.6,
    },
    confirmText: {
      fontSize: normalize(15),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
    },
  });
