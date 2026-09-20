import { HEADER_HEIGHT, useScrollHeader } from '@/components/layout/scroll-header-context';
import { Fonts } from '@/constants/theme';
import AppFrame from '@/features/dashboard/components/app-frame';
import {
  EarningsPeriod,
  formatHours,
  formatNaira,
  useEarningsDashboard,
} from '@/features/earnings/use-fetch';
import RecentDeliverySkeleton from '@/features/home/components/recent-delivery-skeleton';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated as RNAnimated, RefreshControl, StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PERIODS: { label: string; value: EarningsPeriod }[] = [
  { label: 'Today', value: 'TODAY' },
  { label: 'Week', value: 'WEEK' },
  { label: 'Month', value: 'MONTH' },
];

function formatBreakdownDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function EarningsScreen( ){
  const [period, setPeriod] = useState<EarningsPeriod>('WEEK');

  const { data, isLoading, isFetching, refetch } = useEarningsDashboard(period);

  const wallet = data?.wallet;
  const summary = data?.summary;
  const breakdown = (data?.breakdown ?? []).filter((day) => day.deliveries > 0);

  const pulseAnim = useRef(new RNAnimated.Value(0.4)).current;

  useEffect(() => {
    if (isLoading) {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, {
            toValue: 0.9,
            duration: 700,
            useNativeDriver: true,
          }),
          RNAnimated.timing(pulseAnim, {
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

   const { Colors, isDark } = useTheme();
    const styles = createStyles(Colors);

 
  const onFrameMutedText = isDark
    ? Colors.textSecondary
    : Colors.backgroundTertiary;
  
      const insets = useSafeAreaInsets()
  
      const scrollHandler = useScrollHeader();

  return (
  <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
             contentContainerStyle={{ paddingTop: HEADER_HEIGHT + insets.top }}
             refreshControl={
               <RefreshControl
                 refreshing={isFetching && !isLoading}
                 onRefresh={refetch}
                 progressViewOffset={HEADER_HEIGHT + insets.top}
               />
             }
          >

        <View style={styles.container}>
      {/* 1. Wallet Balance Hero Master Card */}
      <View style={styles.walletHeroCard}>
        <AppFrame>
          <View style={styles.walletHeaderHeader}>
            <Ionicons
              name="wallet-outline"
              size={scale(16)}
              color={onFrameMutedText}
            />
            <Text style={[styles.walletTitleLabel, { color: onFrameMutedText }]}>
              Wallet Balance
            </Text>
          </View>

          {isLoading ? (
            <RNAnimated.View
              style={[styles.skeletonBalance, { opacity: pulseAnim }]}
            />
          ) : (
            <Text style={[styles.mainBalanceText, { color: Colors.primary }]}>
              {formatNaira(wallet?.availableBalance)}
            </Text>
          )}

          {isLoading ? (
            <RNAnimated.View
              style={[styles.skeletonPending, { opacity: pulseAnim }]}
            />
          ) : (
            <Text style={[styles.pendingText, { color: onFrameMutedText }]}>
              Pending: {formatNaira(wallet?.pendingBalance)}
            </Text>
          )}
        </AppFrame>
      </View>

      {/* 2. Horizontal Timeframe Filter Pill Toggles */}
      <View style={styles.timeframeFilterRow}>
        {PERIODS.map(({ label, value }) => {
          const isActive = period === value;

          return (
            <TouchableOpacity
              key={value}
              style={isActive ? styles.activeFilterFilter : styles.inactiveFilterFilter}
              onPress={() => setPeriod(value)}
            >
              <Text style={isActive ? styles.activeFilterText : styles.inactiveFilterText}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Performance Core Metric Grid Panels */}
      <View style={styles.metricsGridContainer}>
        <View style={styles.metricItemCard}>
          <Text style={styles.metricLabel}>Total Earnings</Text>
          {isLoading ? (
            <RNAnimated.View
              style={[styles.skeletonMetric, { opacity: pulseAnim }]}
            />
          ) : (
            <Text style={[styles.metricValue, { color: Colors.primary }]}>
              {formatNaira(summary?.totalEarnings)}
            </Text>
          )}
        </View>

        <View style={styles.metricItemCard}>
          <Text style={styles.metricLabel}>Deliveries</Text>
          {isLoading ? (
            <RNAnimated.View
              style={[styles.skeletonMetric, { opacity: pulseAnim }]}
            />
          ) : (
            <Text style={[styles.metricValue, { color: Colors.text }]}>
              {summary?.deliveries ?? 0}
            </Text>
          )}
        </View>

        <View style={styles.metricItemCard}>
          <Text style={styles.metricLabel}>Tips Earned</Text>
          {isLoading ? (
            <RNAnimated.View
              style={[styles.skeletonMetric, { opacity: pulseAnim }]}
            />
          ) : (
            <Text style={[styles.metricValue, { color: Colors.success }]}>
              {formatNaira(summary?.tipsEarned)}
            </Text>
          )}
        </View>

        <View style={styles.metricItemCard}>
          <Text style={styles.metricLabel}>Bonuses</Text>
          {isLoading ? (
            <RNAnimated.View
              style={[styles.skeletonMetric, { opacity: pulseAnim }]}
            />
          ) : (
            <Text style={[styles.metricValue, { color: Colors.info }]}>
              {formatNaira(summary?.bonuses)}
            </Text>
          )}
        </View>
      </View>

      {/* 4. Per-day earnings breakdown for the selected period */}
      <View style={styles.historyContainer}>
        <Text style={styles.sectionHeaderTitle}>Delivery Breakdown</Text>

        {isLoading && <RecentDeliverySkeleton count={3} />}

        {!isLoading && breakdown.length === 0 && (
          <Text style={styles.emptyText}>No deliveries in this period yet.</Text>
        )}

        {breakdown.map((day) => (
          <View key={day.date} style={styles.payoutRowCard}>
            <View style={styles.payoutLeftGroup}>
              <View style={styles.bankIconFrame}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={scale(18)}
                  color={Colors.success}
                />
              </View>
              <View>
                <Text style={styles.payoutTitle}>{formatBreakdownDate(day.date)}</Text>
                <Text style={styles.payoutSubtext}>
                  {day.deliveries} {day.deliveries === 1 ? 'delivery' : 'deliveries'} • {formatHours(day.onlineHours)} online
                </Text>
              </View>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.payoutAmountText, { color: Colors.primary }]}>
                {formatNaira(day.earnings)}
              </Text>
              <Text style={styles.payoutSubtext}>earned</Text>
            </View>
          </View>
        ))}
      </View>
      </View>
  </Animated.ScrollView>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
   container: {
       flex: 1,
       paddingHorizontal: scale(20),
       paddingVertical: scale(24),
       backgroundColor: Colors.background,
       gap: scale(16),
     },
    walletHeroCard: {
      marginBottom: scale(16),
    },
    walletHeaderHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(6),
    },
    walletTitleLabel: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandMedium,
    },
    mainBalanceText: {
      fontSize: normalize(28),
      fontFamily: Fonts.brandSemiBold,
      marginTop: scale(12),
    },
    pendingText: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandRegular,
      marginTop: scale(4),
    },
    emptyText: {
      fontSize: normalize(12),
      color: Colors.textMuted,
      fontFamily: Fonts.brandRegular,
    },
    skeletonBalance: {
      width: scale(170),
      height: scale(32),
      borderRadius: scale(6),
      backgroundColor: Colors.light,
      marginTop: scale(12),
    },
    skeletonPending: {
      width: scale(110),
      height: scale(12),
      borderRadius: scale(6),
      backgroundColor: Colors.light,
      marginTop: scale(8),
    },
    skeletonMetric: {
      width: scale(90),
      height: scale(20),
      borderRadius: scale(6),
      backgroundColor: Colors.light,
    },
    timeframeFilterRow: {
      flexDirection: 'row',
      backgroundColor: Colors.inputBackground,
      borderRadius: scale(12),
      padding: scale(4),
      marginBottom: scale(16),
    },
    activeFilterFilter: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingVertical: scale(8),
      borderRadius: scale(8),
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.border,
    },
    activeFilterText: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },
    inactiveFilterFilter: {
      flex: 1,
      paddingVertical: scale(8),
      alignItems: 'center',
    },
    inactiveFilterText: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
    },
    metricsGridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: scale(10),
      marginBottom: scale(20),
    },
    metricItemCard: {
      width: '48.5%', // Handles responsive 2-column spacing gracefully
      backgroundColor: Colors.card,
      borderRadius: scale(14),
      padding: scale(14),
      borderWidth: 1,
      borderColor: Colors.border,
    },
    metricLabel: {
      fontSize: normalize(12),
      color: Colors.textSecondary,
      fontFamily: Fonts.brandRegular,
      marginBottom: scale(4),
    },
    metricValue: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
    },
    historyContainer: {
      gap: scale(10),
    },
    sectionHeaderTitle: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
      marginBottom: scale(4),
    },
    payoutRowCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.inputBackground,
      padding: scale(14),
      borderRadius: scale(12),
    },
    payoutLeftGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
    },
    bankIconFrame: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.successExtraLight,
    },
    payoutTitle: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },
    payoutSubtext: {
      fontSize: normalize(11),
      color: Colors.textMuted,
      fontFamily: Fonts.brandRegular,
      marginTop: scale(2),
    },
    payoutAmountText: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandSemiBold,
    },
  });