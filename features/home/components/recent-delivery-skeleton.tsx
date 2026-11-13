import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React, { useEffect } from 'react';
import type { DimensionValue } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type RecentDeliverySkeletonProps = {
  count?: number;
};

export function Block({
  width = '100%',
  height = 16,
  radius = 8,
}: {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
}) {
  const { Colors } = useTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 700 }), -1, true);
    return () => cancelAnimation(opacity);
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: Colors.backgroundTertiary,
        },
        pulseStyle,
      ]}
    />
  );
}

export default function RecentDeliverySkeleton({
  count = 3,
}: RecentDeliverySkeletonProps) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          <Block width={40} height={40} radius={20} />

          <View style={styles.details}>
            <Block width="70%" height={14} />
            <Block width="40%" height={11} />
            <Block width="30%" height={11} />
          </View>

          <Block width={64} height={14} />
        </View>
      ))}
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      gap: Spacing.two,
    },

    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    details: {
      flex: 1,
      gap: 6,
    },
  });
