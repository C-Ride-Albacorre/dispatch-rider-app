import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
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
}: {
  title: string;
  value: string;
  percent: number;
  color: string;
}) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const width = useSharedValue(0);

  // Grow the bar each time the metric is revealed
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
    </View>
  );
}

export default function DriverPerformance({
  stats,
}: {
  stats?: {
    rating?: number;
  };
}) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const rating = stats?.rating ?? 0;

  return (
    <View style={styles.metricsContainer}>
      <MetricBar
        title="Overall rating"
        value={`${rating.toFixed(1)}/5.0`}
        percent={rating * 20}
        color={Colors.success}
      />
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
  });
