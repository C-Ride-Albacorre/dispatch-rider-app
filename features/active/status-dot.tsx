import { useTheme } from "@/hooks/use-theme";
import { scale } from "@/utils/scaling";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";



export default function StatusDot({ active }: { active: boolean }) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      pulse.value = 0;
      return;
    }

    pulse.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    );
  }, [active]);

  const ringStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: 1 + pulse.value * 2.5,
        },
      ],
      opacity: 1 - pulse.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* 🔵 Broadcast ring */}
      {active && (
        <Animated.View
          style={[
            styles.ring,
            ringStyle,
            { borderColor: Colors.success },
          ]}
        />
      )}

      {/* 🔵 Core dot */}
      <View
        style={[
          styles.dot,
          {
            backgroundColor: active
              ? Colors.success
              : Colors.primary,
          },
        ]}
      />
    </View>
  );
}const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      width: scale(20),
      height: scale(20),
      justifyContent: "center",
      alignItems: "center",
    },

    dot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
      position: "absolute",
      zIndex: 2,
    },

    ring: {
      position: "absolute",
      width: scale(8),
      height: scale(8),
      borderRadius: scale(999),
      borderWidth: 2,
      opacity: 0.6,
    },
  });