import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

/** Avatar, name and rating at the top of Profile */
export default function ProfileFrame({
  stats,
  driverInfo,
  isLoading,
}: {
  stats?: {
    rating?: number;
    totalDeliveries?: number;
  };
  driverInfo?: {
    name?: string;
    role?: string;
    profileImage?: string | null;
    firstName?: string;
    lastName?: string;
  };
  isLoading?: boolean;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const fullName =
    `${driverInfo?.firstName || ''} ${driverInfo?.lastName || ''}`.trim();

  const displayName =
    `${driverInfo?.firstName?.[0] || ''}${driverInfo?.lastName?.[0] || ''}`
      .trim()
      .toUpperCase();

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

  if (isLoading) {
    return (
      <View style={styles.identity}>
        <Animated.View
          style={[styles.skeleton, styles.avatar, styles.skeletonAvatar, { opacity: pulseAnim }]}
        />

        <View style={styles.flex}>
          <Animated.View
            style={[styles.skeleton, styles.skeletonName, { opacity: pulseAnim }]}
          />
          <Animated.View
            style={[styles.skeleton, styles.skeletonLine, { opacity: pulseAnim }]}
          />
          <Animated.View
            style={[
              styles.skeleton,
              styles.skeletonLineWide,
              { opacity: pulseAnim },
            ]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.identity}>
      <View style={styles.avatar}>
        <ThemedText style={styles.initials} themeColor="onPrimary">
          {displayName}
        </ThemedText>
      </View>

      <View style={styles.flex}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {fullName}
        </ThemedText>

        <ThemedText style={styles.detail} themeColor="textMuted">
          Premium Care Partner
        </ThemedText>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color={Colors.primary} />
          <ThemedText style={styles.detail} themeColor="textMuted">
            {stats?.rating?.toFixed(1)} · {stats?.totalDeliveries} total rides
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    identity: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
    },

    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primary,
    },

    initials: {
      fontFamily: Fonts.brandBold,
      fontSize: 22,
      lineHeight: 28,
    },

    name: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      textTransform: 'capitalize',
    },

    detail: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
    },

    skeleton: {
      borderRadius: 6,
      backgroundColor: Colors.backgroundTertiary,
    },

    skeletonAvatar: {
      backgroundColor: Colors.backgroundTertiary,
    },

    skeletonName: {
      width: 160,
      height: 22,
      marginBottom: 4,
    },

    skeletonLine: {
      width: 110,
      height: 14,
      marginBottom: 4,
    },

    skeletonLineWide: {
      width: 150,
      height: 14,
    },
  });
