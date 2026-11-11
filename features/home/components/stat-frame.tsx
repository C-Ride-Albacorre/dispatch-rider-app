import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import {
  EarningsSummary,
  formatHours,
  formatNaira,
} from '@/features/earnings/use-fetch';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export default function StatFrame({
  stats,
  earnings,
  isLoading,
}: {
  stats?: {
    totalDeliveries: number;
    rating: number;
  };
  earnings?: EarningsSummary;
  isLoading?: boolean;
}) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.push('/earnings')}
        style={({ pressed }) => [styles.earnings, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Today’s earnings"
      >
        <View style={styles.flex}>
          <ThemedText style={styles.earningsLabel} themeColor="onPrimary">
            Today’s earnings
          </ThemedText>
          <ThemedText style={styles.earningsValue} themeColor="onPrimary">
            {isLoading ? '–' : formatNaira(earnings?.totalEarnings)}
          </ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.onPrimary} />
      </Pressable>

      <View style={styles.stats}>
        <Stat
          label="Deliveries"
          value={isLoading ? '–' : String(earnings?.deliveries ?? 0)}
        />
        <Stat
          label="Rating"
          value={isLoading ? '–' : (stats?.rating?.toFixed(1) ?? '0.0')}
          icon={<Ionicons name="star" size={14} color={Colors.primary} />}
        />
        <Stat
          label="Online"
          value={isLoading ? '–' : formatHours(earnings?.onlineHours)}
        />
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.stat} accessibilityLabel={`${value} ${label}`}>
      <View style={styles.statValueRow}>
        <ThemedText style={styles.statValue} themeColor="white" numberOfLines={1}>
          {value}
        </ThemedText>
        {icon}
      </View>
      <ThemedText style={styles.statLabel} themeColor="white">
        {label}
      </ThemedText>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      gap: Spacing.two,
    },

    flex: {
      flex: 1,
      gap: 2,
    },

    earnings: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      padding: 14,
      borderRadius: 16,
      backgroundColor: Colors.primary,
    },

    earningsLabel: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 16,
    },

    earningsValue: {
      fontFamily: Fonts.brandBold,
      fontSize: 24,
      lineHeight: 30,
    },

    pressed: {
      opacity: 0.8,
    },

    stats: {
      flexDirection: 'row',
      gap: Spacing.two,
    },

    stat: {
      flex: 1,
      gap: 2,
      padding: 14,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.glassBorder,
      backgroundColor: Colors.glass,
    },

    statValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    statValue: {
      fontFamily: Fonts.brandBold,
      fontSize: 20,
      lineHeight: 26,
      flexShrink: 1,
    },

    statLabel: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 16,
    },
  });
