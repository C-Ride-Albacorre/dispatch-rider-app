import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { JobProps } from '../types';

export default function RenderJobHeader({ jobs }: { jobs: JobProps[] }) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.8,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <View style={styles.header}>
      <ThemedText style={styles.title}>Available Jobs</ThemedText>

      <View style={styles.searchStatus}>
        <View style={styles.signal}>
          <Animated.View
            style={[
              styles.beam,
              {
                transform: [{ scale: pulse }],
                opacity: pulse.interpolate({
                  inputRange: [1, 1.8],
                  outputRange: [0.5, 0],
                }),
              },
            ]}
          />

          <View style={styles.dot} />
        </View>

        <ThemedText style={styles.subtitle} themeColor="success">
          {jobs.length} request nearby
        </ThemedText>
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.two,
      paddingBottom: 12,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
    },

    // Live status pill
    searchStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: Colors.successExtraLight,
    },

    subtitle: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 17,
    },

    signal: {
      width: 12,
      height: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },

    dot: {
      width: 6,
      height: 6,
      borderRadius: 999,
      backgroundColor: Colors.success,
    },

    beam: {
      position: 'absolute',
      width: 12,
      height: 12,
      borderRadius: 999,
      backgroundColor: Colors.success,
    },
  });
