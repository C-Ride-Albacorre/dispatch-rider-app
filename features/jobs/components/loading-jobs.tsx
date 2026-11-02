import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export default function LoadingJobs() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.iconWrapper}>
        <Ionicons name="location-outline" size={28} color={Colors.success} />
      </View>

      <ThemedText style={styles.loadingText} themeColor="success">
        Finding orders close to you...
      </ThemedText>
    </Animated.View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.three,
      paddingHorizontal: Spacing.four,
    },

    loadingText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
    },

    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.successExtraLight,
    },
  });
