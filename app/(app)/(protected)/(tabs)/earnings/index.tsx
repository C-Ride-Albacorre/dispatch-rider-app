import ScreenHeader from '@/components/layout/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import DateRangeModal, {
  DayRange,
  formatDayKey,
} from '@/features/earnings/components/date-range-modal';
import AmountVisibilityToggle from '@/features/earnings/components/amount-visibility-toggle';
import {
  MASKED_AMOUNT,
  useAmountVisibility,
} from '@/store/amount-visibility-store';
import {
  EarningsPeriod,
  EarningsRange,
  formatHours,
  formatNaira,
  formatNairaCompact,
  useEarningsDashboard,
} from '@/features/earnings/use-fetch';
import RecentDeliverySkeleton from '@/features/home/components/recent-delivery-skeleton';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated as RNAnimated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const PRESET_PERIODS: {
  label: string;
  value: Exclude<EarningsPeriod, 'CUSTOM'>;
}[] = [
  { label: 'Today', value: 'TODAY' },
  { label: 'This week', value: 'WEEK' },
  { label: 'This month', value: 'MONTH' },
];

/** Picked calendar days are sent as full UTC days, matching the backend's day buckets. */
function toEarningsRange({ start, end }: DayRange): EarningsRange {
  return { from: `${start}T00:00:00.000Z`, to: `${end}T23:59:59.999Z` };
}

function formatRangeLabel({ start, end }: DayRange) {
  return start === end
    ? formatDayKey(start)
    : `${formatDayKey(start)} – ${formatDayKey(end)}`;
}

function formatBreakdownDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function EarningsScreen() {
  const [period, setPeriod] = useState<EarningsPeriod>('WEEK');
  const [customRange, setCustomRange] = useState<DayRange | null>(null);
  const [showRangeModal, setShowRangeModal] = useState(false);

  const apiRange = useMemo(
    () => (customRange ? toEarningsRange(customRange) : undefined),
    [customRange],
  );

  const { data, isLoading, isFetching, refetch } = useEarningsDashboard(
    period,
    period === 'CUSTOM' ? apiRange : undefined,
  );

  const handleApplyRange = (range: DayRange) => {
    setCustomRange(range);
    setPeriod('CUSTOM');
    setShowRangeModal(false);
  };

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

  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const amountsHidden = useAmountVisibility((s) => s.hidden);
  const money = (format: (amount?: number) => string, amount?: number) =>
    amountsHidden ? MASKED_AMOUNT : format(amount);

  const metrics: { label: string; value: string; color: string }[] = [
    {
      label: 'Total earnings',
      value: money(formatNairaCompact, summary?.totalEarnings),
      color: Colors.primary,
    },
    {
      label: 'Deliveries',
      value: String(summary?.deliveries ?? 0),
      color: Colors.text,
    },
    {
      label: 'Tips earned',
      value: money(formatNairaCompact, summary?.tipsEarned),
      color: Colors.success,
    },
    {
      label: 'Bonuses',
      value: money(formatNairaCompact, summary?.bonuses),
      color: Colors.info,
    },
  ];

  return (
    <ThemedView style={styles.flex}>
      <StatusBar style="auto" />
      <ScreenHeader title="Earnings" subtitle="Your wallet and delivery pay" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={Colors.textMuted}
          />
        }
      >
        {/* Wallet balance */}
        <View style={styles.walletCard}>
          <View style={styles.walletLabelRow}>
            <Ionicons
              name="wallet-outline"
              size={16}
              color={Colors.onPrimary}
            />
            <ThemedText style={styles.walletLabel} themeColor="onPrimary">
              Wallet balance
            </ThemedText>
            <View style={styles.flex} />
            <AmountVisibilityToggle color={Colors.onPrimary} />
          </View>

          {isLoading ? (
            <RNAnimated.View style={{ opacity: pulseAnim }}>
              <View
                style={[styles.skeletonOnPrimary, styles.skeletonBalance]}
              />
            </RNAnimated.View>
          ) : (
            <ThemedText style={styles.walletBalance} themeColor="onPrimary">
              {money(formatNaira, wallet?.availableBalance)}
            </ThemedText>
          )}

          {isLoading ? (
            <RNAnimated.View style={{ opacity: pulseAnim }}>
              <View
                style={[styles.skeletonOnPrimary, styles.skeletonPending]}
              />
            </RNAnimated.View>
          ) : (
            <ThemedText style={styles.walletPending} themeColor="onPrimary">
              Available to Withdraw: {money(formatNaira, wallet?.pendingBalance)}
            </ThemedText>
          )}
        </View>

        {/* Period filter */}
        <View style={styles.section}>
          <View style={styles.periods}>
            {PRESET_PERIODS.map(({ label, value }) => (
              <Button
                key={value}
                size="xs"
                variant={period === value ? 'chipActive' : 'chip'}
                onPress={() => setPeriod(value)}
              >
                {label}
              </Button>
            ))}
            <Button
              size="xs"
              variant={period === 'CUSTOM' ? 'chipActive' : 'chip'}
              onPress={() => setShowRangeModal(true)}
              leftIcon={
                <Ionicons
                  name="calendar-outline"
                  size={13}
                  color={
                    period === 'CUSTOM'
                      ? Colors.onPrimary
                      : Colors.textSecondary
                  }
                />
              }
            >
              {period === 'CUSTOM' && customRange
                ? formatRangeLabel(customRange)
                : 'Custom'}
            </Button>
          </View>

          {/* Summary metrics */}
          <View style={styles.metrics}>
            {metrics.map((metric) => (
              <View key={metric.label} style={styles.metricCard}>
                <ThemedText style={styles.metricLabel} themeColor="textMuted">
                  {metric.label}
                </ThemedText>
                {isLoading ? (
                  <RNAnimated.View
                    style={[styles.skeletonMetric, { opacity: pulseAnim }]}
                  />
                ) : (
                  <ThemedText
                    style={[styles.metricValue, { color: metric.color }]}
                    numberOfLines={1}
                  >
                    {metric.value}
                  </ThemedText>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Per-day earnings breakdown for the selected period */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Delivery breakdown
          </ThemedText>

          {isLoading && <RecentDeliverySkeleton count={3} />}

          {!isLoading && breakdown.length === 0 && (
            <View style={styles.empty}>
              <Ionicons
                name="receipt-outline"
                size={20}
                color={Colors.textMuted}
              />
              <ThemedText style={styles.emptyText} themeColor="textMuted">
                No deliveries in this period yet.
              </ThemedText>
            </View>
          )}

          {breakdown.length > 0 && (
            <View style={styles.listCard}>
              {breakdown.map((day, index) => (
                <View
                  key={`${day.date}-${index}`}
                  style={[
                    styles.row,
                    index === breakdown.length - 1 && styles.lastRow,
                  ]}
                >
                  <View style={styles.rowIcon}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color={Colors.success}
                    />
                  </View>

                  <View style={styles.flex}>
                    <ThemedText style={styles.rowTitle} numberOfLines={1}>
                      {formatBreakdownDate(day.date)}
                    </ThemedText>
                    <ThemedText style={styles.rowMeta} themeColor="textMuted">
                      {day.deliveries}{' '}
                      {day.deliveries === 1 ? 'delivery' : 'deliveries'} ·{' '}
                      {formatHours(day.onlineHours)} online
                    </ThemedText>
                  </View>

                  <View style={styles.rowAmountGroup}>
                    <ThemedText style={styles.rowAmount}>
                      {money(formatNaira, day.earnings)}
                    </ThemedText>
                    <ThemedText style={styles.rowMeta} themeColor="textMuted">
                      earned
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <DateRangeModal
        visible={showRangeModal}
        initialRange={customRange}
        onClose={() => setShowRangeModal(false)}
        onApply={handleApplyRange}
      />
    </ThemedView>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    content: {
      gap: Spacing.four,
      paddingHorizontal: Spacing.three,
      paddingBottom: Spacing.five,
    },

    section: {
      gap: 12,
    },

    walletCard: {
      gap: Spacing.one,
      padding: Spacing.three,
      borderRadius: 16,
      backgroundColor: Colors.primary,
    },

    walletLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    walletLabel: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },

    walletBalance: {
      fontFamily: Fonts.brandBold,
      fontSize: 28,
      lineHeight: 36,
      marginTop: Spacing.one,
    },

    walletPending: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
      opacity: 0.75,
    },

    skeletonOnPrimary: {
      borderRadius: 6,
      backgroundColor: Colors.onPrimary,
      opacity: 0.15,
    },

    skeletonBalance: {
      width: 170,
      height: 32,
      marginVertical: Spacing.one,
    },

    skeletonPending: {
      width: 110,
      height: 14,
      marginTop: Spacing.one,
    },

    periods: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },

    metrics: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
    },

    metricCard: {
      flexGrow: 1,
      flexBasis: '45%',
      gap: 2,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    metricLabel: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    metricValue: {
      fontFamily: Fonts.brandBold,
      fontSize: 20,
      lineHeight: 26,
    },

    skeletonMetric: {
      width: 90,
      height: 22,
      marginTop: 2,
      borderRadius: 6,
      backgroundColor: Colors.backgroundTertiary,
    },

    sectionTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
    },

    empty: {
      alignItems: 'center',
      gap: Spacing.two,
      padding: Spacing.four,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
    },

    emptyText: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    listCard: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: Spacing.three,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
    },

    lastRow: {
      borderBottomWidth: 0,
    },

    rowIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.successExtraLight,
    },

    rowTitle: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
    },

    rowMeta: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    rowAmountGroup: {
      alignItems: 'flex-end',
    },

    rowAmount: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
    },
  });
