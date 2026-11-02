import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

type IconName = keyof typeof Ionicons.glyphMap;

export default function Earnings() {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <SectionHeader title="Earnings overview" subtitle="How your earnings are trending" />

        <View style={styles.list}>
          <SummaryTile label="This month" value="₦ 12,500" tint={Colors.successExtraLight} />
          <SummaryTile label="This week" value="₦ 42,500" tint={Colors.primaryExtraLight} />
          <SummaryTile label="This month" value="₦ 112,500" tint={Colors.backgroundTertiary} />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Earnings breakdown" subtitle="Where this week's money came from" />

        <View style={styles.card}>
          <BreakdownRow icon="cash-outline" label="Base earnings" value="₦ 12,500" />
          <BreakdownRow icon="trophy-outline" label="Performance bonus" value="₦ 28,500" />
          <BreakdownRow icon="cash-outline" label="Tips" value="₦ 12,500" />

          <View style={[styles.row, styles.total]}>
            <ThemedText style={styles.cardTitle}>Total this week</ThemedText>
            <ThemedText style={styles.cardTitle} themeColor="primary">
              ₦285,400
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.sectionHeader}>
      <View style={styles.flex}>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <ThemedText style={styles.sectionSubtitle} themeColor="textMuted">
          {subtitle}
        </ThemedText>
      </View>

      <View style={styles.pill}>
        <ThemedText style={styles.pillText} themeColor="textSecondary">
          This week
        </ThemedText>
      </View>
    </View>
  );
}

function SummaryTile({ label, value, tint }: { label: string; value: string; tint: string }) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={[styles.tile, { backgroundColor: tint }]}>
      <View style={styles.tileText}>
        <ThemedText style={styles.label} themeColor="textMuted">
          {label}
        </ThemedText>
        <ThemedText style={styles.tileValue}>{value}</ThemedText>
      </View>

      <Ionicons name="trending-up-outline" size={18} color={Colors.success} />
    </View>
  );
}

function BreakdownRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.row}>
      <View style={styles.rowLabel}>
        <Ionicons name={icon} size={16} color={Colors.primary} />
        <ThemedText style={styles.body} themeColor="textSecondary">
          {label}
        </ThemedText>
      </View>

      <ThemedText style={styles.value}>{value}</ThemedText>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    container: {
      gap: Spacing.four,
    },

    section: {
      gap: Spacing.three,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: Spacing.two,
    },

    sectionTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
    },

    sectionSubtitle: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 18,
    },

    pill: {
      paddingHorizontal: Spacing.two,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: Colors.backgroundTertiary,
    },

    pillText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
    },

    list: {
      gap: Spacing.two,
    },

    tile: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderRadius: 16,
    },

    tileText: {
      gap: 2,
    },

    label: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },

    tileValue: {
      fontFamily: Fonts.brandBold,
      fontSize: 20,
      lineHeight: 26,
    },

    card: {
      gap: 12,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },

    rowLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
    },

    body: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
    },

    value: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
    },

    total: {
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
    },

    cardTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },
  });
