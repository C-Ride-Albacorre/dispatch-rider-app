import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import IconButton from '@/components/ui/buttons/icon-button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, StyleSheet, View } from 'react-native';

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
            <ThemedText style={styles.title}>Preview image</ThemedText>
            <IconButton
              icon="close"
              size="sm"
              variant="secondary"
              onPress={onCancel}
              disabled={isLoading}
              accessibilityLabel="Close preview"
            />
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
            <ThemedText style={styles.sizeText} themeColor="textMuted">
              {Math.round(imageSize.width)} × {Math.round(imageSize.height)} px
            </ThemedText>
          )}

          <View style={styles.actions}>
            <Button
              variant="outline"
              onPress={onCancel}
              disabled={isLoading}
              style={styles.flex}
            >
              Cancel
            </Button>

            <Button
              onPress={onConfirm}
              loading={isLoading}
              disabled={isLoading}
              style={styles.flex}
              leftIcon={
                <Ionicons name="send" size={16} color={Colors.onPrimary} />
              }
            >
              Send
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    overlay: {
      flex: 1,
      backgroundColor: Colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.three,
    },

    container: {
      width: '100%',
      maxHeight: '85%',
      backgroundColor: Colors.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: Colors.border,
      overflow: 'hidden',
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.three,
      paddingVertical: 12,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
    },

    imageContainer: {
      width: '100%',
      height: 300,
      backgroundColor: Colors.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },

    image: {
      width: '100%',
      height: '100%',
    },

    sizeText: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
      textAlign: 'center',
      paddingTop: 12,
    },

    actions: {
      flexDirection: 'row',
      gap: 12,
      padding: Spacing.three,
    },
  });
