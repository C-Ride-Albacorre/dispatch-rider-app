import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { EarningsPerformance } from '@/features/earnings/use-fetch';
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
        accessibilityRole="button"
      >
        <Ionicons
          name={icon}
          size={20}
          color={isDanger ? Colors.error : Colors.textMuted}
        />

        <View style={styles.rowText}>
          <ThemedText
            style={styles.rowTitle}
            themeColor={isDanger ? 'error' : 'text'}
          >
            {title}
          </ThemedText>

          {subtitle ? (
            <ThemedText
              style={styles.rowSubtitle}
              themeColor="textMuted"
              numberOfLines={1}
            >
              {subtitle}
            </ThemedText>
          ) : null}
        </View>

        <Animated.View style={expandable ? chevronStyle : undefined}>
          <Ionicons
            name="chevron-forward"
            size={18}
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
  performance,
  onSignOut,
  onDeleteAccount,
}: {
  stats?: { rating?: number };
  performance?: EarningsPerformance;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const [showPerformance, setShowPerformance] = useState(false);

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.groupLabel} themeColor="textMuted">
        Account
      </ThemedText>

      <Animated.View layout={LinearTransition.duration(220)} style={styles.card}>
        <MenuRow
          icon="stats-chart-outline"
          title="Performance metrics"
          subtitle="Your rating and delivery performance"
          expandable
          expanded={showPerformance}
          onPress={() => setShowPerformance((v) => !v)}
        >
          <DriverPerformance stats={stats} performance={performance} />
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
      gap: Spacing.two,
    },

    groupLabel: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      paddingHorizontal: Spacing.one,
    },

    card: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    row: {
      overflow: 'hidden',
    },

    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },

    rowHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      padding: Spacing.three,
    },

    pressed: {
      backgroundColor: Colors.backgroundSecondary,
    },

    rowText: {
      flex: 1,
    },

    rowTitle: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
    },

    rowSubtitle: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    rowBody: {
      paddingHorizontal: Spacing.three,
      paddingBottom: Spacing.three,
    },
  });
