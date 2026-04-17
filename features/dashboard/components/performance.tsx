import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

export default function Performance() {
  return (
    <View style={styles.performanceContainer}>
      <View style={styles.performanceMetrics}>
        <Text style={styles.performanceTitle}>Performance Metrics</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <View style={styles.ratingContainer}>
              <Text style={styles.metricTitle}>Overall Rating</Text>

              <View style={styles.ratingValue}>
                <Ionicons name="star" size={16} color={Colors.primary} />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}></View>
            </View>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.ratingContainer}>
              <Text style={styles.metricTitle}>Acceptance Rate</Text>

              <Text style={styles.ratingText}>96%</Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}></View>
            </View>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.ratingContainer}>
              <Text style={styles.metricTitle}>On - Time Delivery</Text>

              <Text style={styles.ratingText}>98%</Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}></View>
            </View>
          </View>

          <View style={styles.metricItem}>
            <View style={styles.ratingContainer}>
              <Text style={styles.metricTitle}>Completion Rate</Text>

              <Text style={styles.ratingText}>99%</Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}></View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsTitle}>Recent Reviews</Text>

        <View style={styles.reviewCard}>
          <View style={styles.reviewerInfo}>
            <Text style={styles.reviewerName}>Adebayo W.</Text>

            <View style={styles.reviewerRating}>
              <Ionicons name="star" size={16} color={Colors.primary} />

              <Text style={styles.reviewerRatingText}>5.0</Text>
            </View>
          </View>

          <Text style={styles.reviewText}>
            "Excellent service! The delivery was super fast and the rider was
            very professional. Highly recommend!"
          </Text>

          <Text style={styles.reviewTime}>2 hours ago</Text>
        </View>
      </View>

      <View style={styles.weeklyStatsContainer}>
        <Text style={styles.weeklyStatisticsTitle}>Weekly Statistics</Text>

        <View style={styles.weeklyStatsGrid}>
          <View
            style={[
              styles.weeklyStatCard,
              { backgroundColor: Colors.primary + '1A' },
            ]}
          >
            <Ionicons name="bicycle-outline" size={24} color={Colors.primary} />

            <Text style={styles.weeklyStatTitle}>Deliveries</Text>

            <Text style={styles.weeklyStatValue}>87</Text>
          </View>

          <View
            style={[
              styles.weeklyStatCard,
              { backgroundColor: Colors.success + '1A' },
            ]}
          >
            <Ionicons name="cash-outline" size={24} color={Colors.success} />

            <Text style={styles.weeklyStatTitle}>Earnings</Text>

            <Text style={styles.weeklyStatValue}>NGN 285,400</Text>
          </View>

          <View
            style={[styles.weeklyStatCard, { backgroundColor: Colors.light }]}
          >
            <Ionicons
              name="time-outline"
              size={24}
              color={Colors.textSecondary}
            />

            <Text style={styles.weeklyStatTitle}>Hours</Text>

            <Text style={styles.weeklyStatValue}>42.5</Text>
          </View>

          <View
            style={[
              styles.weeklyStatCard,
              { backgroundColor: Colors.primary + '1A' },
            ]}
          >
            <Ionicons name="cash-outline" size={24} color={Colors.primary} />

            <Text style={styles.weeklyStatTitle}>Tips</Text>

            <Text style={styles.weeklyStatValue}>NGN 12,500</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  performanceContainer: {
    gap: 32,
  },

  performanceMetrics: {
    gap: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  performanceTitle: {
    fontSize: 16,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.text,
  },

  metricsGrid: {
    gap: 32,
  },

  metricItem: {
    gap: 12,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  metricTitle: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },

  ratingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.inputBackground,
    borderRadius: 3,
    marginTop: 8,
  },

  progressBar: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    width: '80%',
  },

  reviewsContainer: {
    gap: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  reviewsTitle: {
    fontSize: 16,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.text,
  },

  reviewCard: {
    gap: 24,
  },

  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  reviewerName: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },

  reviewerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  reviewerRatingText: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.primary,
  },

  reviewText: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.text,
    letterSpacing: 0.25,
    lineHeight: 24,
  },

  reviewTime: {
    fontSize: 12,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  weeklyStatsContainer: {
    gap: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  weeklyStatisticsTitle: {
    fontSize: 16,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.text,
  },

  weeklyStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },

  weeklyStatCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },

  weeklyStatTitle: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },

  weeklyStatValue: {
    fontSize: 18,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.text,
  },
});
