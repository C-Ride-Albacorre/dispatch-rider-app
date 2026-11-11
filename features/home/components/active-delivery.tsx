import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ActiveOrderProps } from '@/store/driver-jobs-store';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export type DeliveryPhase = 'IDLE' | 'TO_VENDOR' | 'TO_CUSTOMER' | 'DELIVERED';

const STEPS = ['Accepted', 'Picked up', 'Delivered'];

const PHASE_STEP: Record<DeliveryPhase, number> = {
  IDLE: 0,
  TO_VENDOR: 0,
  TO_CUSTOMER: 1,
  DELIVERED: 2,
};

function formatEta(seconds: number | null) {
  if (seconds == null) return null;
  if (seconds < 60) return `${Math.max(Math.round(seconds), 1)} sec`;
  return `${Math.ceil(seconds / 60)} min`;
}

function LiveDot({ color }: { color: string }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.out(Easing.ease) }),
      -1,
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.6 * (1 - pulse.value),
    transform: [{ scale: 1 + pulse.value * 1.4 }],
  }));

  return (
    <View style={liveDotStyles.wrapper}>
      <Animated.View
        style={[liveDotStyles.ring, { backgroundColor: color }, ringStyle]}
      />
      <View style={[liveDotStyles.dot, { backgroundColor: color }]} />
    </View>
  );
}

export default function ActiveDelivery({
  activeOrder,
  phase,
  etaVendor,
  etaCustomer,
}: {
  activeOrder: ActiveOrderProps;
  phase: DeliveryPhase;
  etaVendor: number | null;
  etaCustomer: number | null;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const pressScale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const toCustomer = phase === 'TO_CUSTOMER' || phase === 'DELIVERED';
  const currentStep = PHASE_STEP[phase];

  const statusLabel = toCustomer ? 'Heading to customer' : 'Heading to pickup';
  const eta = formatEta(toCustomer ? etaCustomer : etaVendor);

  const nextStop = toCustomer
    ? {
        icon: 'home-outline' as const,
        label: 'Drop-off',
        title: 'Customer',
        address: [
          activeOrder.dropoff_location?.address,
          activeOrder.dropoff_location?.city,
        ]
          .filter(Boolean)
          .join(', '),
      }
    : {
        icon: 'storefront-outline' as const,
        label: 'Pickup',
        title: activeOrder.store_name,
        address: activeOrder.pickup_location?.address,
      };

  const itemCount =
    activeOrder.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) ??
    0;

  const orderRef =
    activeOrder.order_number?.split('-')[1] ||
    activeOrder.order_id.slice(0, 8).toUpperCase();

  const openActiveTab = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(app)/(protected)/(tabs)/active');
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.flex}>
          <View style={styles.liveRow}>
            <LiveDot color={Colors.success} />
            <ThemedText style={styles.sectionTitle}>Active delivery</ThemedText>
          </View>
          <ThemedText style={styles.sectionSubtitle} themeColor="textMuted">
            Tap to pick up where you left off
          </ThemedText>
        </View>

        <View style={styles.statusPill}>
          <Ionicons
            name={toCustomer ? 'navigate' : 'bicycle'}
            size={12}
            color={Colors.success}
          />
          <ThemedText style={styles.statusPillText} themeColor="success">
            {statusLabel}
          </ThemedText>
        </View>
      </View>

      <Animated.View style={pressStyle}>
        <Pressable
          onPress={openActiveTab}
          onPressIn={() => {
            pressScale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
          }}
          onPressOut={() => {
            pressScale.value = withSpring(1, { damping: 12, stiffness: 250 });
          }}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Continue delivery"
        >
          {/* Store summary */}
          <View style={styles.storeRow}>
            {activeOrder.store_logo ? (
              <Image
                source={{ uri: activeOrder.store_logo }}
                style={styles.storeLogo}
              />
            ) : (
              <View style={styles.storeLogo}>
                <Ionicons
                  name="storefront-outline"
                  size={20}
                  color={Colors.textMuted}
                />
              </View>
            )}

            <View style={styles.storeText}>
              <ThemedText style={styles.storeName} numberOfLines={1}>
                {activeOrder.store_name}
              </ThemedText>
              <ThemedText
                style={styles.meta}
                themeColor="textMuted"
                numberOfLines={1}
              >
                #{orderRef} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </ThemedText>
            </View>

            <ThemedText style={styles.amount}>
              ₦{(activeOrder.total_amount || 0).toLocaleString()}
            </ThemedText>
          </View>

          {/* Progress stepper */}
          <View style={styles.stepper}>
            {STEPS.map((step, index) => {
              const done = index < currentStep;
              const current = index === currentStep;
              const reached = done || current;

              return (
                <View key={step} style={styles.step}>
                  <View
                    style={[styles.stepBar, reached && styles.stepBarDone]}
                  />
                  <View style={styles.stepLabelRow}>
                    {done ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={12}
                        color={Colors.success}
                      />
                    ) : null}
                    <ThemedText
                      style={[
                        styles.stepLabel,
                        reached && styles.stepLabelActive,
                      ]}
                      themeColor={reached ? 'text' : 'textMuted'}
                    >
                      {step}
                    </ThemedText>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Next stop */}
          <View style={styles.nextStop}>
            <View style={styles.nextStopIcon}>
              <Ionicons name={nextStop.icon} size={18} color={Colors.primary} />
            </View>

            <View style={styles.nextStopText}>
              <ThemedText style={styles.nextStopLabel} themeColor="textMuted">
                Next stop · {nextStop.label}
              </ThemedText>
              <ThemedText style={styles.nextStopTitle} numberOfLines={1}>
                {nextStop.title}
              </ThemedText>
              {nextStop.address ? (
                <ThemedText
                  style={styles.meta}
                  themeColor="textSecondary"
                  numberOfLines={1}
                >
                  {nextStop.address}
                </ThemedText>
              ) : null}
            </View>

            <View style={styles.etaBox}>
              <ThemedText style={styles.etaValue} themeColor="success">
                {eta ?? '--'}
              </ThemedText>
              <ThemedText style={styles.etaLabel} themeColor="textMuted">
                ETA
              </ThemedText>
            </View>
          </View>

          {/* CTA */}
          <View style={styles.cta}>
            <ThemedText style={styles.ctaText} themeColor="onPrimary">
              Continue delivery
            </ThemedText>
            <Ionicons name="arrow-forward" size={16} color={Colors.onPrimary} />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const liveDotStyles = StyleSheet.create({
  wrapper: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      gap: Spacing.three,
    },

    flex: {
      flex: 1,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: Spacing.two,
    },

    liveRow: {
      flexDirection: 'row',
      alignItems: 'center',
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

    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
      paddingVertical: 2,
      paddingHorizontal: Spacing.two,
      borderRadius: 999,
      backgroundColor: Colors.successExtraLight,
    },

    statusPillText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
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

    pressed: {
      backgroundColor: Colors.backgroundSecondary,
    },

    storeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    storeLogo: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.backgroundTertiary,
    },

    storeText: {
      flex: 1,
      gap: 2,
    },

    storeName: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
      textTransform: 'capitalize',
    },

    meta: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    amount: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
    },

    stepper: {
      flexDirection: 'row',
      gap: Spacing.one,
    },

    step: {
      flex: 1,
      gap: 6,
    },

    stepBar: {
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.backgroundTertiary,
    },

    stepBarDone: {
      backgroundColor: Colors.success,
    },

    stepLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
    },

    stepLabel: {
      fontFamily: Fonts.brandRegular,
      fontSize: 11,
      lineHeight: 16,
    },

    stepLabelActive: {
      fontFamily: Fonts.brandMedium,
    },

    nextStop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 12,
      backgroundColor: Colors.backgroundSecondary,
    },

    nextStopIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.primaryExtraLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    nextStopText: {
      flex: 1,
      gap: 2,
    },

    nextStopLabel: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },

    nextStopTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
      textTransform: 'capitalize',
    },

    etaBox: {
      alignItems: 'flex-end',
    },

    etaValue: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    etaLabel: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
    },

    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.two,
      height: 44,
      borderRadius: 999,
      backgroundColor: Colors.primary,
    },

    ctaText: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
    },
  });
