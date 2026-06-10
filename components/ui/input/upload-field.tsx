import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.uploadBox, isUploaded && styles.uploadedBox]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isUploaded ? 'checkmark-circle' : 'cloud-upload-outline'}
          size={20}
          color={isUploaded ? Colors.success : Colors.textSecondary}
        />

        <Text
          style={[styles.uploadText, isUploaded && styles.uploadedText]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {fileName || 'Tap to upload file'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      gap: scale(8),
    },

  label: {
    fontSize: normalize(16),
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },

  uploadBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: scale(12),
    padding: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: Colors.inputBackground,
  },

  uploadedBox: {
    borderColor: Colors.success,
    backgroundColor: Colors.successExtraLight,
  },

  uploadText: {
    fontSize: normalize(14),
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  uploadedText: {
    color: Colors.success,
    fontFamily: Fonts.brandMedium,
  },
});
