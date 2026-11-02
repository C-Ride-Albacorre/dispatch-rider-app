import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const FILL_DURATION = 1400;
const HOLD_DURATION = 250;
const FADE_DURATION = 350;

/**
 * Primary "Accept" call-to-action with a looping left-to-right fill
 * that keeps new job requests feeling live.
 */
export default function AcceptButton({
  amount,
  onPress,
  style,
  label = 'Accept',
}: {
  amount: number;
  onPress: () => void;
  style?: ViewStyle;
  label?: string;
}) {
  const { Colors, isDark } = useTheme();

  const [width, setWidth] = useState(0);

  // 0 → 1 progress of the fill sweep, plus its opacity for the reset fade
  const progress = useSharedValue(0);
  const fillOpacity = useSharedValue(1);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (!width) return;

    progress.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, {
          duration: FILL_DURATION,
          easing: Easing.inOut(Easing.cubic),
        }),
        withDelay(HOLD_DURATION + FADE_DURATION, withTiming(1, { duration: 0 })),
      ),
      -1,
    );

    fillOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withDelay(
          FILL_DURATION + HOLD_DURATION,
          withTiming(0, { duration: FADE_DURATION }),
        ),
      ),
      -1,
    );

    return () => {
      cancelAnimation(progress);
      cancelAnimation(fillOpacity);
    };
  }, [width]);

  const fillStyle = useAnimatedStyle(() => ({
    opacity: fillOpacity.value,
    transform: [{ translateX: (progress.value - 1) * width }],
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handleLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Animated.View style={[pressStyle, style]}>
      <Pressable
        onLayout={handleLayout}
        onPress={handlePress}
        onPressIn={() => {
          pressScale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1, { damping: 12, stiffness: 250 });
        }}
        style={[styles.button, { backgroundColor: Colors.primary }]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.fill,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.4)' },
            fillStyle,
          ]}
        />

        <View style={styles.content}>
          <Ionicons name="flash" size={16} color={Colors.onPrimary} />
          <ThemedText style={styles.text} themeColor="onPrimary" numberOfLines={1}>
            {label} · ₦{(amount || 0).toLocaleString()}
          </ThemedText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Same footprint as the shared Button (size md, pill)
  button: {
    height: 52,
    borderRadius: 999,
    paddingHorizontal: Spacing.four,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fill: {
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  text: {
    fontFamily: Fonts.brandSemiBold,
    fontSize: 14,
    lineHeight: 20,
  },
});
