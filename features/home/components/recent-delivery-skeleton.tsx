import { useTheme } from '@/hooks/use-theme';
import { scale } from '@/utils/scaling';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from 'react-native';

type RecentDeliverySkeletonProps = {
  count?: number;
};

export default function RecentDeliverySkeleton({
  count = 3,
}: RecentDeliverySkeletonProps) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmerAnim]);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-400, 400],
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.deliveriesListItem}>
          {/* Status icon */}
          <View style={styles.statusIcon}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.shimmer,
                {
                  transform: [
                    {
                      translateX: shimmerTranslateX,
                    },
                  ],
                },
              ]}
            />
          </View>

          {/* Customer details */}
          <View style={styles.customerDetails}>
            {/* Customer name */}
            <View style={[styles.skeleton, styles.customerName]}>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.shimmer,
                  {
                    transform: [
                      {
                        translateX: shimmerTranslateX,
                      },
                    ],
                  },
                ]}
              />
            </View>

            {/* Order number */}
            <View style={[styles.skeleton, styles.orderNumber]}>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.shimmer,
                  {
                    transform: [
                      {
                        translateX: shimmerTranslateX,
                      },
                    ],
                  },
                ]}
              />
            </View>

            {/* Time */}
            <View style={[styles.skeleton, styles.timeAgo]}>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.shimmer,
                  {
                    transform: [
                      {
                        translateX: shimmerTranslateX,
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>

          {/* Delivery fare */}
          <View style={styles.deliveryFare}>
            <View style={[styles.skeleton, styles.amount]}>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.shimmer,
                  {
                    transform: [
                      {
                        translateX: shimmerTranslateX,
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      gap: scale(10),
    },

    // =====================================
    // DELIVERY ITEM
    // =====================================

    deliveriesListItem: {
      gap: scale(12),
      backgroundColor: Colors.inputBackground,
      borderRadius: scale(12),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scale(12),
      paddingVertical: scale(16),
      overflow: 'hidden',
    },

    // =====================================
    // SKELETON BASE
    // =====================================

    skeleton: {
      backgroundColor: Colors.border,
      borderRadius: scale(4),
      overflow: 'hidden',
    },

    // =====================================
    // SHIMMER
    // =====================================

    shimmer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: -100,
      width: 80,
      backgroundColor: 'rgba(255, 255, 255, 0.35)',
      transform: [
        {
          skewX: '-20deg',
        },
      ],
    },

    // =====================================
    // STATUS ICON
    // =====================================

    statusIcon: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      backgroundColor: Colors.border,
      overflow: 'hidden',
    },

    // =====================================
    // CUSTOMER DETAILS
    // =====================================

    customerDetails: {
      flex: 1,
      gap: scale(5),
    },

    customerName: {
      width: '70%',
      height: scale(12),
    },

    orderNumber: {
      width: '40%',
      height: scale(9),
    },

    timeAgo: {
      width: '30%',
      height: scale(9),
    },

    // =====================================
    // DELIVERY FARE
    // =====================================

    deliveryFare: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },

    amount: {
      width: scale(75),
      height: scale(14),
    },
  });

