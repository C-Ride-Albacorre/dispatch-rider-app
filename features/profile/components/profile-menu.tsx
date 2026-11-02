import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import DriverPerformance from './performamce';

type MenuRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  tone?: 'default' | 'danger';
  expanded?: boolean;
  expandable?: boolean;
  onPress: () => void;
  isLast?: boolean;
  children?: React.ReactNode;
};

function MenuRow({
  icon,
  title,
  subtitle,
  tone = 'default',
  expanded = false,
  expandable = false,
  onPress,
  isLast,
  children,
}: MenuRowProps) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const isDanger = tone === 'danger';
  const accent = isDanger ? Colors.error : Colors.primary;

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(expanded ? 90 : 0, { duration: 200 });
  }, [expanded]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      layout={LinearTransition.duration(220)}
      style={[styles.row, !isLast && styles.rowDivider]}
    >
      <Pressable
        onPress={() => {
          void Haptics.selectionAsync();
          onPress();
        }}
        android_ripple={{ color: Colors.border }}
        style={({ pressed }) => [styles.rowHeader, pressed && styles.pressed]}
      >
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: isDanger ? Colors.errorLight : Colors.primaryLight },
          ]}
        >
          <Ionicons name={icon} size={scale(18)} color={accent} />
        </View>

        <View style={styles.rowText}>
          <Text
            style={[styles.rowTitle, isDanger && { color: Colors.error }]}
          >
            {title}
          </Text>

          {subtitle ? (
            <Text style={styles.rowSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <Animated.View style={expandable ? chevronStyle : undefined}>
          <Ionicons
            name="chevron-forward-outline"
            size={scale(18)}
            color={isDanger ? Colors.error : Colors.textMuted}
          />
        </Animated.View>
      </Pressable>

      {expandable && expanded ? (
        <Animated.View
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(150)}
          style={styles.rowBody}
        >
          {children}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

export default function ProfileMenu({
  stats,
  onSignOut,
  onDeleteAccount,
}: {
  stats?: { rating?: number };
  onSignOut: () => void;
  onDeleteAccount: () => void;
}) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const [showPerformance, setShowPerformance] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.groupLabel}>ACCOUNT</Text>

      <Animated.View layout={LinearTransition.duration(220)} style={styles.card}>
        <MenuRow
          icon="stats-chart-outline"
          title="Performance Metrics"
          subtitle="Your rating and delivery performance"
          expandable
          expanded={showPerformance}
          onPress={() => setShowPerformance((v) => !v)}
        >
          <DriverPerformance stats={stats} />
        </MenuRow>

        <MenuRow
          icon="log-out-outline"
          title="Sign out"
          subtitle="Log out of this device"
          onPress={onSignOut}
        />

        <MenuRow
          icon="trash-outline"
          title="Delete account"
          subtitle="Permanently delete your account and data"
          tone="danger"
          onPress={onDeleteAccount}
          isLast
        />
      </Animated.View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    wrapper: {
      gap: scale(8),
    },

    groupLabel: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.textMuted,
      letterSpacing: 0.6,
      paddingHorizontal: scale(4),
    },

    card: {
      borderRadius: scale(12),
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.background,
      overflow: 'hidden',
    },

    row: {
      overflow: 'hidden',
    },

    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },

    rowHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
      paddingHorizontal: scale(14),
      paddingVertical: scale(14),
    },

    pressed: {
      backgroundColor: Colors.backgroundSecondary,
    },

    iconWrapper: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(10),
      alignItems: 'center',
      justifyContent: 'center',
    },

    rowText: {
      flex: 1,
      gap: scale(2),
    },

    rowTitle: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
    },

    rowSubtitle: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandRegular,
      color: Colors.textSecondary,
    },

    rowBody: {
      paddingHorizontal: scale(14),
      paddingBottom: scale(16),
      paddingTop: scale(2),
    },
  });
