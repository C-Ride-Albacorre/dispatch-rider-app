import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

export default function NoJobs() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.iconWrapper}>
        <Ionicons name="bicycle-outline" size={28} color={Colors.textMuted} />
      </View>

      <View style={styles.emptyTextGroup}>
        <ThemedText style={styles.title}>No Jobs Available</ThemedText>
        <ThemedText style={styles.subtitle} themeColor="textMuted">
          Please check back later.
        </ThemedText>
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.three,
      paddingVertical: Spacing.six,
      paddingHorizontal: Spacing.four,
    },

    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.backgroundTertiary,
    },

    emptyTextGroup: {
      alignItems: 'center',
      gap: Spacing.one,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 16,
      lineHeight: 22,
      textAlign: 'center',
    },

    subtitle: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
    },
  });
