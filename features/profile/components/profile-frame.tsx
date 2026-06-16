import { Fonts } from '@/constants/theme';
import AppFrame from '@/features/dashboard/components/app-frame';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

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
  const { Colors, isDark } = useTheme();

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
      <AppFrame>
        <View style={styles.profileHeader}>
          {/* Avatar */}
          <Animated.View
            style={[styles.skeletonAvatar, { opacity: pulseAnim }]}
          />

          {/* Info */}
          <View style={styles.profileInfo}>
            <Animated.View
              style={[styles.skeletonName, { opacity: pulseAnim }]}
            />

            <Animated.View
              style={[styles.skeletonRole, { opacity: pulseAnim }]}
            />

            <Animated.View
              style={[styles.skeletonStats, { opacity: pulseAnim }]}
            />
          </View>
        </View>
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Animated.Text
            style={[styles.profileAvatarText, { opacity: pulseAnim }]}
          >
            {displayName}
          </Animated.Text>
        </View>

        <View style={styles.profileInfo}>
          <View>{<Text style={styles.profileName}>{fullName}</Text>}</View>

          <Text style={styles.profileRole}>Premium Care Partner</Text>

          <View>
            <View style={styles.profileStats}>
              <View style={styles.profileStatItem}>
                <Ionicons name="star" size={scale(10)} color={Colors.primary} />
              </View>

              <Text style={styles.profileRating}>{stats?.rating}</Text>

              <View style={styles.dot}></View>

              <Text style={styles.profileRides}>
                {stats?.totalDeliveries} total rides
              </Text>
            </View>
          </View>
        </View>
      </View>
    </AppFrame>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(20),
      backgroundColor: Colors.background,
      gap: scale(16),
      marginTop: scale(24),
    },

    profileHeader: {
      flexDirection: 'row',
      gap: scale(16),
      // paddingVertical: scale(16),
    },

    profileAvatar: {
      width: scale(80),
      height: scale(80),
      borderRadius: scale(40),
      borderWidth: 2,
      borderColor: Colors.primary,
      backgroundColor: Colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },

    profileAvatarText: {
      fontSize: scale(32),
      color: Colors.primary,
      fontFamily: Fonts.brandMedium,
      lineHeight: scale(24),
    },

    profileInfo: {
      flexDirection: 'column',
      gap: scale(2),
    },

    profileName: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
      color: '#fff',
    },

    profileRole: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
    },

    profileStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
    },

    dot: {
      width: scale(4),
      height: scale(4),
      borderRadius: scale(100),
      backgroundColor: Colors.primary,
    },

    profileStatItem: {
      flexDirection: 'row',
      gap: scale(2),
      marginBottom: scale(0),
    },

    profileRating: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandRegular,
      color: Colors.primary,
    },

    profileRides: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandRegular,
      color: Colors.primary,
    },

    skeletonAvatar: {
      width: scale(80),
      height: scale(80),
      borderRadius: scale(40),
      backgroundColor: Colors.light,
    },

    skeletonName: {
      width: scale(140),
      height: scale(18),
      borderRadius: scale(6),
      backgroundColor: Colors.light,
      marginBottom: scale(8),
    },

    skeletonRole: {
      width: scale(100),
      height: scale(12),
      borderRadius: scale(6),
      backgroundColor: Colors.light,
      marginBottom: scale(12),
    },

    skeletonStats: {
      width: scale(160),
      height: scale(12),
      borderRadius: scale(6),
      backgroundColor: Colors.light,
    },
  });
