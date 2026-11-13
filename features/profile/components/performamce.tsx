import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { EarningsPerformance } from '@/features/earnings/use-fetch';
import { useTheme } from '@/hooks/use-theme';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

function MetricBar({
  title,
  value,
  percent,
  color,
  caption,
}: {
  title: string;
  value: string;
  percent: number;
  color: string;
  caption?: string;
}) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(Math.max(percent, 0), 100), {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [percent]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={styles.metricItem}>
      <View style={styles.metricHeader}>
        <ThemedText style={styles.metricTitle} themeColor="textSecondary">
          {title}
        </ThemedText>
        <ThemedText style={styles.metricValue}>{value}</ThemedText>
      </View>

      <View style={styles.metricProgressBarContainer}>
        <Animated.View
          style={[styles.metricProgressBar, { backgroundColor: color }, barStyle]}
        />
      </View>

      {caption && (
        <ThemedText style={styles.caption} themeColor="textMuted">
          {caption}
        </ThemedText>
      )}
    </View>
  );
}

const formatRate = (rate?: number) => `${Number((rate ?? 0).toFixed(1))}%`;

export default function DriverPerformance({
  stats,
  performance,
}: {
  stats?: {
    rating?: number;
  };
  performance?: EarningsPerformance;
}) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const rating = stats?.rating ?? 0;
  const counts = performance?.counts;

  return (
    <View style={styles.metricsContainer}>
      <MetricBar
        title="Overall rating"
        value={`${rating.toFixed(1)}/5.0`}
        percent={rating * 20}
        color={Colors.success}
      />

      {performance && (
        <>
          <MetricBar
            title="Acceptance rate"
            value={formatRate(performance.acceptanceRate)}
            percent={performance.acceptanceRate}
            color={Colors.primary}
            caption={`${counts?.accepted ?? 0} of ${counts?.offered ?? 0} offers accepted`}
          />
          <MetricBar
            title="Completion rate"
            value={formatRate(performance.completionRate)}
            percent={performance.completionRate}
            color={Colors.info}
            caption={`${counts?.completed ?? 0} of ${counts?.accepted ?? 0} accepted orders completed`}
          />
          <MetricBar
            title="On-time rate"
            value={formatRate(performance.onTimeRate)}
            percent={performance.onTimeRate}
            color={Colors.success}
            caption={`${counts?.onTime ?? 0} deliveries on time`}
          />

          {performance.scope === 'lifetime' && (
            <ThemedText style={styles.scopeNote} themeColor="textMuted">
              Based on all your deliveries to date.
            </ThemedText>
          )}
        </>
      )}
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    metricsContainer: {
      gap: Spacing.three,
    },

    metricItem: {
      gap: Spacing.two,
    },

    metricHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    metricTitle: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    metricValue: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 13,
      lineHeight: 18,
    },

    metricProgressBarContainer: {
      height: 6,
      borderRadius: 3,
      backgroundColor: Colors.backgroundTertiary,
      overflow: 'hidden',
    },

    metricProgressBar: {
      height: '100%',
      borderRadius: 3,
    },

    caption: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 16,
    },

    scopeNote: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 16,
      fontStyle: 'italic',
    },
  });
