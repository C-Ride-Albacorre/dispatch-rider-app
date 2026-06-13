import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { StyleSheet, Text, View } from 'react-native';

const Progress_Bar_Color = {
  rating: {
    backgroundColor: Colors.success,
  },
  acceptance: {
    backgroundColor: Colors.primary,
  },
  onTime: {
    backgroundColor: Colors.primary,
  },

  completion: {
    backgroundColor: Colors.primary,
  },
};

export default function DriverPerformance({
  stats,
}: {
  stats?: {
    rating: number;
  };
}) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Performance Metrics</Text>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>Overall Rating</Text>
            <Text style={styles.metricValue}>{stats?.rating}/5.0</Text>
          </View>

          <View style={styles.metricProgressBarContainer}>
            <View style={[styles.metricProgressBar, Progress_Bar_Color.rating, { width: `${(stats?.rating ?? 0) * 20}%` }]}></View>
          </View>
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>Acceptance Rate</Text>
            <Text style={styles.metricValue}>0%</Text>
          </View>

          <View style={styles.metricProgressBarContainer}>
            <View style={[styles.metricProgressBar, Progress_Bar_Color.acceptance, { width: `${0}%` }]}></View>
          </View>
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>On-Time Delivery</Text>
            <Text style={styles.metricValue}>0%</Text>
          </View>

          <View style={styles.metricProgressBarContainer}>
            <View style={[styles.metricProgressBar, Progress_Bar_Color.onTime, { width: `${0}%` }]}></View>
          </View>
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricTitle}>Completion Rate</Text>
            <Text style={styles.metricValue}>0%</Text>
          </View>

          <View style={styles.metricProgressBarContainer}>
            <View style={[styles.metricProgressBar, Progress_Bar_Color.completion, { width: `${0}%` }]}></View>
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    section: {
      gap: scale(12),
      padding: scale(16),
      borderRadius: scale(12),
      borderWidth: 1,
      borderColor: Colors.border,
    },

    sectionTitle: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },

    metricsContainer: {
      gap: scale(16),
    },

    metricItem: {
      gap: scale(8),
    },
    metricHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    metricTitle: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandRegular,
      color: Colors.text,
    },
    metricValue: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },
    metricProgressBarContainer: {
      height: scale(6),
      borderRadius: scale(3),
      backgroundColor: Colors.border,
      overflow: 'hidden',
    },
    metricProgressBar: {
      height: '100%',
      width: '75%',
      borderRadius: scale(3),
      backgroundColor: Colors.primary,
    },
  });
