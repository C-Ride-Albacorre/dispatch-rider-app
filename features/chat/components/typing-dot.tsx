import { useRef, useEffect } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

export default function TypingDot({
  delay,
  Colors,
}: {
  delay: number;
  Colors: any;
}) {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),

        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 260,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(scaleAnim, {
          toValue: 0.6,
          duration: 260,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: Colors.textMuted,
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
