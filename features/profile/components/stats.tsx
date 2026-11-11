import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import {
  EarningsSummary,
  formatHours,
  formatNairaCompact,
} from '@/features/earnings/use-fetch';
import { useTheme } from '@/hooks/use-theme';
import { StyleSheet, View } from 'react-native';

export default function DriverStats({
  earnings,
}: {
  earnings?: EarningsSummary;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <ThemedText style={styles.statValue} numberOfLines={1}>
          {earnings?.deliveries ?? 0}
        </ThemedText>
        <ThemedText style={styles.statLabel} themeColor="textMuted">
          Deliveries
        </ThemedText>
      </View>

      <View style={styles.statItem}>
        <ThemedText
          style={styles.statValue}
          themeColor="primary"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatNairaCompact(earnings?.totalEarnings)}
        </ThemedText>
        <ThemedText style={styles.statLabel} themeColor="textMuted">
          Earnings
        </ThemedText>
      </View>

      <View style={styles.statItem}>
        <ThemedText style={styles.statValue} numberOfLines={1}>
          {formatHours(earnings?.onlineHours)}
        </ThemedText>
        <ThemedText style={styles.statLabel} themeColor="textMuted">
          Online
        </ThemedText>
      </View>
    </View>
  );
}

const createStyles = (Colors: ReturnType<typeof useTheme>['Colors']) =>
  StyleSheet.create({
    statsRow: {
      flexDirection: 'row',
      gap: Spacing.two,
    },

    statItem: {
      flex: 1,
      gap: 2,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    statValue: {
      fontFamily: Fonts.brandBold,
      fontSize: 18,
      lineHeight: 24,
    },

    statLabel: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },
  });
