import { Colors, Fonts } from '@/constants/theme';
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
          color={isUploaded ? Colors.primary : Colors.textSecondary}
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

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },

  label: {
    fontSize: 16,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },

  uploadBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.inputBackground,
  },

  uploadedBox: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },

  uploadText: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  uploadedText: {
    color: Colors.primary,
    fontFamily: Fonts.brandMedium,
  },
});
