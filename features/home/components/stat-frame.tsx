import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function StatFrame({
  stats,
  isLoading,
}: {
  stats?: {
    totalDeliveries: number;
    rating: number;
  };
  isLoading?: boolean;
}) {
  const { Colors, isDark } = useTheme();

  const styles = createStyles(Colors);

  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.9,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isLoading]);

  return (
    <LinearGradient
      colors={isDark ? ['#111827', '#1F2937'] : ['#111111', '#3A3A3A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.statsFrame}
    >
      <View style={styles.earningsRow}>
        <Text
          style={[
            styles.earningsText,
            isDark
              ? { color: Colors.text }
              : { color: Colors.backgroundTertiary },
          ]}
        >
          Today's Earnings
        </Text>

        <Text
          style={[
            styles.earningsAmount,
            isDark ? { color: Colors.text } : { color: Colors.background },
          ]}
        >
          NGN 0:00
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            {isLoading ? (
              <Animated.View
                style={[styles.skeletonValue, { opacity: pulseAnim }]}
              />
            ) : (
              <Text
                style={[
                  styles.statValue,
                  isDark
                    ? { color: Colors.text }
                    : { color: Colors.background },
                ]}
              >
                {stats?.totalDeliveries ?? '0'}
              </Text>
            )}

            <Text
              style={[
                styles.statLabel,
                isDark
                  ? { color: Colors.textSecondary }
                  : { color: Colors.backgroundTertiary },
              ]}
            >
              Deliveries
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                isDark ? { color: Colors.text } : { color: Colors.background },
              ]}
            >
              {isLoading ? (
                <Animated.View
                  style={[styles.skeletonValue, { opacity: pulseAnim }]}
                />
              ) : (
                <Text>
                  {stats?.rating ?? '0.0'}
                  <Ionicons name="star" size={14} color="gold" />
                </Text>
              )}
            </Text>

            <Text
              style={[
                styles.statLabel,
                isDark
                  ? { color: Colors.textSecondary }
                  : { color: Colors.backgroundTertiary },
              ]}
            >
              Rating
            </Text>
          </View>

          <View style={styles.statItem}>
            {isLoading ? (
              <Animated.View
                style={[styles.skeletonValue, { opacity: pulseAnim }]}
              />
            ) : (
              <Text
                style={[
                  styles.statValue,
                  isDark
                    ? { color: Colors.text }
                    : { color: Colors.background },
                ]}
              >
                0h
              </Text>
            )}

            <Text
              style={[
                styles.statLabel,
                isDark
                  ? { color: Colors.textSecondary }
                  : { color: Colors.backgroundTertiary },
              ]}
            >
              Online Time
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bubbleTop}></View>

      <View style={styles.bubbleBottom}></View>
    </LinearGradient>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    statsFrame: {
      borderRadius: scale(14),
      padding: scale(20),
      overflow: 'hidden',
      position: 'relative',
  },
  earningsRow: {
    flexDirection: 'column',
    gap: scale(12),
  },

  earningsText: {
    fontSize: normalize(12),
    fontFamily: Fonts.brandMedium,
  },

  earningsAmount: {
    fontSize: normalize(24),
    fontFamily: Fonts.brandSemiBold,
  },

  statsRow: {
    flexDirection: 'row',
    gap: scale(20),
    marginTop: scale(16),
  },

  statItem: {
    flexDirection: 'column',
    gap: scale(4),
  },

  statValue: {
    fontSize: normalize(14),
    fontFamily: Fonts.brandRegular,
  },

  skeletonValue: {
    height: scale(28),
    width: scale(60),
    backgroundColor: Colors.light,
    borderRadius: scale(6),
  },

  statLabel: {
    fontSize: normalize(10),
    fontFamily: Fonts.brandMedium,
  },

  bubbleTop: {
    position: 'absolute',
    width: scale(120),
    height: scale(120),
    borderRadius: scale(999),
    backgroundColor: Colors.primaryLight,
    top: scale(-40),
    right: scale(-30),
  },

  bubbleBottom: {
    position: 'absolute',
    width: scale(80),
    height: scale(80),
    borderRadius: scale(999),
    backgroundColor: Colors.successExtraLight,
    bottom: scale(-30),
    right: scale(20),
  },
});
