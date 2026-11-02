import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

type UploadFieldProps = {
  label?: string;
  onPress?: () => void;
  fileName?: string;
};

export default function UploadField({
  label,
  onPress,
  fileName,
}: UploadFieldProps) {
  const isUploaded = !!fileName;

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View>
      {label && (
        <ThemedText style={styles.label} themeColor="textSecondary">
          {label}
        </ThemedText>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.uploadBox,
          isUploaded && styles.uploadedBox,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label ?? 'Upload file'}
      >
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: isUploaded
                ? Colors.successExtraLight
                : Colors.backgroundTertiary,
            },
          ]}
        >
          <Ionicons
            name={isUploaded ? 'checkmark' : 'cloud-upload-outline'}
            size={18}
            color={isUploaded ? Colors.success : Colors.textMuted}
          />
        </View>

        <ThemedText
          style={[styles.uploadText, isUploaded && styles.uploadedText]}
          themeColor={isUploaded ? 'success' : 'textMuted'}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {fileName || 'Tap to upload file'}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    label: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: Spacing.two,
    },

    uploadBox: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.two,
      padding: Spacing.three,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: Colors.border,
      borderRadius: 16,
      backgroundColor: Colors.inputBackground,
    },

    uploadedBox: {
      borderStyle: 'solid',
      borderColor: Colors.success,
      backgroundColor: Colors.successExtraLight,
    },

    pressed: {
      opacity: 0.8,
    },

    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },

    uploadText: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    uploadedText: {
      fontFamily: Fonts.brandMedium,
    },
  });
