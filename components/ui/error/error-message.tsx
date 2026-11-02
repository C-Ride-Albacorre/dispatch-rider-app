import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

export default function ErrorMessage({ message }: { message: string }) {
  const { Colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: Colors.errorLight }]}
      role="alert"
    >
      <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
      <ThemedText style={styles.text} themeColor="error">
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
  },

  text: {
    flex: 1,
    fontFamily: Fonts.brandMedium,
    fontSize: 13,
    lineHeight: 18,
  },
});
