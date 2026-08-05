
import { JobProps } from '../types';
import { useTheme } from '@/hooks/use-theme';
import { StyleSheet } from 'react-native';
import { normalize, scale } from '@/utils/scaling';
import { Fonts } from '@/constants/theme';

import { Text, View, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

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
      <Text style={styles.title}>Available Jobs</Text>

      <View style={styles.searchStatus}>
        <View style={styles.signal}>
          <Animated.View
            style={[
              styles.beam,
              {
                transform: [
                  {
                    scale: pulse,
                  },
                ],
                opacity: pulse.interpolate({
                  inputRange: [1, 1.8],
                  outputRange: [0.5, 0],
                }),
              },
            ]}
          />

          <View style={styles.dot} />
        </View>

        <Text
          style={[
            styles.subtitle,
            {
              color: Colors.success,
            },
          ]}
        >
          {jobs.length} request nearby
        </Text>
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

      paddingVertical: scale(16),
    },

    title: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },

    searchStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
    },

    subtitle: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
    },

    signal: {
      width: scale(14),
      height: scale(14),

      alignItems: 'center',
      justifyContent: 'center',
    },

    dot: {
      width: scale(7),
      height: scale(7),

      borderRadius: scale(4),

      backgroundColor: Colors.success,
    },

    beam: {
      position: 'absolute',

      width: scale(14),
      height: scale(14),

      borderRadius: scale(7),

      backgroundColor: Colors.success,
    },
  });
