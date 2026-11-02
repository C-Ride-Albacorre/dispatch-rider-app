import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

type IconName = keyof typeof Ionicons.glyphMap;

export default function Performance() {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <SectionHeader title="Performance metrics" subtitle="How customers and vendors see you" />

        <View style={styles.card}>
          <Metric label="Overall rating" value="4.8" star />
          <Metric label="Acceptance rate" value="96%" />
          <Metric label="On-time delivery" value="98%" />
          <Metric label="Completion rate" value="99%" />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Recent reviews" subtitle="What customers said lately" />

        <View style={styles.card}>
          <View style={styles.row}>
            <ThemedText style={styles.cardTitle}>Adebayo W.</ThemedText>
            <View style={styles.inline}>
              <Ionicons name="star" size={16} color={Colors.primary} />
              <ThemedText style={styles.value}>5.0</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.body} themeColor="textSecondary">
            &quot;Excellent service! The delivery was super fast and the rider
            was very professional. Highly recommend!&quot;
          </ThemedText>

          <ThemedText style={styles.meta} themeColor="textMuted">
            2 hours ago
          </ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Weekly statistics" subtitle="Your last seven days at a glance" />

        <View style={styles.grid}>
          <StatTile icon="bicycle-outline" label="Deliveries" value="87" color={Colors.primary} tint={Colors.primaryExtraLight} />
          <StatTile icon="cash-outline" label="Earnings" value="₦ 285,400" color={Colors.success} tint={Colors.successExtraLight} />
          <StatTile icon="time-outline" label="Hours" value="42.5" color={Colors.textSecondary} tint={Colors.backgroundTertiary} />
          <StatTile icon="cash-outline" label="Tips" value="₦ 12,500" color={Colors.primary} tint={Colors.primaryExtraLight} />
        </View>
      </View>
    </View>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <ThemedText style={styles.sectionSubtitle} themeColor="textMuted">
        {subtitle}
      </ThemedText>
    </View>
  );
}

function Metric({ label, value, star }: { label: string; value: string; star?: boolean }) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.metric}>
      <View style={styles.row}>
        <ThemedText style={styles.body}>{label}</ThemedText>
        <View style={styles.inline}>
          {star && <Ionicons name="star" size={16} color={Colors.primary} />}
          <ThemedText style={styles.value}>{value}</ThemedText>
        </View>
      </View>

      <View style={styles.track}>
        <View style={styles.bar} />
      </View>
    </View>
  );
}

function StatTile({
  icon,
  label,
  value,
  color,
  tint,
}: {
  icon: IconName;
  label: string;
  value: string;
  color: string;
  tint: string;
}) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={[styles.tile, { backgroundColor: tint }]}>
      <Ionicons name={icon} size={20} color={color} />
      <ThemedText style={styles.label} themeColor="textMuted">
        {label}
      </ThemedText>
      <ThemedText style={styles.tileValue}>{value}</ThemedText>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      gap: Spacing.four,
    },

    section: {
      gap: Spacing.three,
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

    card: {
      gap: Spacing.three,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.two,
    },

    inline: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
    },

    metric: {
      gap: Spacing.two,
    },

    cardTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
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

    meta: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    track: {
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.backgroundTertiary,
    },

    bar: {
      height: 4,
      borderRadius: 2,
      width: '80%',
      backgroundColor: Colors.primary,
    },

    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: Spacing.two,
    },

    tile: {
      width: '48.5%',
      gap: Spacing.one,
      padding: 14,
      borderRadius: 16,
    },

    label: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginTop: Spacing.one,
    },

    tileValue: {
      fontFamily: Fonts.brandBold,
      fontSize: 18,
      lineHeight: 24,
    },
  });
