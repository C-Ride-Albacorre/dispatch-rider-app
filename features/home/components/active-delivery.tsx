import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ActiveOrderProps } from '@/store/driver-jobs-store';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const { Colors, isDark } = useTheme();

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
        label: 'DROP-OFF',
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
        label: 'PICKUP',
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
    <Animated.View style={pressStyle}>
      <Pressable
        onPress={openActiveTab}
        onPressIn={() => {
          pressScale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1, { damping: 12, stiffness: 250 });
        }}
        style={styles.card}
      >
        {/* Header: live status + order ref */}
        <View style={styles.header}>
          <View style={styles.liveRow}>
            <LiveDot color={Colors.success} />
            <Text style={styles.sectionTitle}>Active Delivery</Text>
          </View>

          <View style={styles.statusPill}>
            <Ionicons
              name={toCustomer ? 'navigate' : 'bicycle'}
              size={scale(12)}
              color={Colors.success}
            />
            <Text style={styles.statusPillText}>{statusLabel}</Text>
          </View>
        </View>

        {/* Store summary */}
        <View style={styles.storeRow}>
          {activeOrder.store_logo ? (
            <Image
              source={{ uri: activeOrder.store_logo }}
              style={styles.storeLogo}
            />
          ) : (
            <View style={[styles.storeLogo, styles.storeLogoPlaceholder]}>
              <Ionicons
                name="storefront"
                size={scale(18)}
                color={Colors.primary}
              />
            </View>
          )}

          <View style={styles.storeText}>
            <Text style={styles.storeName} numberOfLines={1}>
              {activeOrder.store_name}
            </Text>
            <Text style={styles.storeMeta} numberOfLines={1}>
              #{orderRef} • {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Text>
          </View>

          <Text style={styles.amount}>
            ₦{(activeOrder.total_amount || 0).toLocaleString()}
          </Text>
        </View>

        {/* Progress stepper */}
        <View style={styles.stepper}>
          {STEPS.map((step, index) => {
            const done = index < currentStep;
            const current = index === currentStep;
            const reached = done || current;

            return (
              <View key={step} style={styles.step}>
                <View style={styles.stepTrack}>
                  <View
                    style={[
                      styles.stepBar,
                      reached && { backgroundColor: Colors.success },
                    ]}
                  />
                </View>
                <View style={styles.stepLabelRow}>
                  {done ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={scale(12)}
                      color={Colors.success}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.stepLabel,
                      reached && styles.stepLabelActive,
                    ]}
                  >
                    {step}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Next stop */}
        <View style={styles.nextStop}>
          <View style={styles.nextStopIcon}>
            <Ionicons
              name={nextStop.icon}
              size={scale(18)}
              color={Colors.primary}
            />
          </View>

          <View style={styles.nextStopText}>
            <Text style={styles.nextStopLabel}>NEXT STOP • {nextStop.label}</Text>
            <Text style={styles.nextStopTitle} numberOfLines={1}>
              {nextStop.title}
            </Text>
            {nextStop.address ? (
              <Text style={styles.nextStopAddress} numberOfLines={1}>
                {nextStop.address}
              </Text>
            ) : null}
          </View>

          <View style={styles.etaBox}>
            <Text style={styles.etaValue}>{eta ?? '--'}</Text>
            <Text style={styles.etaLabel}>ETA</Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={[styles.ctaText, { color: isDark ? '#1A1A1A' : Colors.text }]}>
            Continue delivery
          </Text>
          <Ionicons
            name="arrow-forward"
            size={scale(16)}
            color={isDark ? '#1A1A1A' : Colors.text}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const liveDotStyles = StyleSheet.create({
  wrapper: {
    width: scale(12),
    height: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
  },
  dot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
});

const createStyles = (Colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: Colors.card,
      borderRadius: scale(16),
      padding: scale(16),
      borderWidth: 1,
      borderColor: Colors.success + '55',
      gap: scale(16),
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: scale(8),
    },

    liveRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
    },

    sectionTitle: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },

    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(4),
      paddingVertical: scale(4),
      paddingHorizontal: scale(10),
      borderRadius: 999,
      backgroundColor: Colors.successExtraLight,
    },

    statusPillText: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandMedium,
      color: Colors.success,
    },

    storeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(10),
    },

    storeLogo: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(10),
      backgroundColor: Colors.backgroundTertiary,
    },

    storeLogoPlaceholder: {
      backgroundColor: Colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    storeText: {
      flex: 1,
      gap: scale(2),
    },

    storeName: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
      textTransform: 'capitalize',
    },

    storeMeta: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandRegular,
      color: Colors.textMuted,
    },

    amount: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },

    stepper: {
      flexDirection: 'row',
      gap: scale(6),
    },

    step: {
      flex: 1,
      gap: scale(6),
    },

    stepTrack: {
      height: scale(4),
      borderRadius: scale(2),
      backgroundColor: Colors.border,
      overflow: 'hidden',
    },

    stepBar: {
      flex: 1,
      borderRadius: scale(2),
    },

    stepLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(3),
    },

    stepLabel: {
      fontSize: normalize(10),
      fontFamily: Fonts.brandRegular,
      color: Colors.textMuted,
    },

    stepLabelActive: {
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
    },

    nextStop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
      padding: scale(12),
      borderRadius: scale(12),
      backgroundColor: Colors.inputBackground,
    },

    nextStopIcon: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(18),
      backgroundColor: Colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    nextStopText: {
      flex: 1,
      gap: scale(2),
    },

    nextStopLabel: {
      fontSize: normalize(9),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.textMuted,
      letterSpacing: 0.5,
    },

    nextStopTitle: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
      textTransform: 'capitalize',
    },

    nextStopAddress: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandRegular,
      color: Colors.textSecondary,
      textTransform: 'capitalize',
    },

    etaBox: {
      alignItems: 'flex-end',
    },

    etaValue: {
      fontSize: normalize(15),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.success,
    },

    etaLabel: {
      fontSize: normalize(10),
      fontFamily: Fonts.brandRegular,
      color: Colors.textMuted,
    },

    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: scale(8),
      paddingVertical: scale(12),
      borderRadius: scale(10),
      backgroundColor: Colors.primary,
    },

    ctaText: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandSemiBold,
    },
  });
