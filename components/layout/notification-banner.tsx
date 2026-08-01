import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useNotificationStore } from '@/store/notification-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/theme';
import { normalize, scale } from '@/utils/scaling';
import { handleNotificationNavigation } from '@/utils/notification-navigation';

export default function NotificationBanner() {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();

  const banner = useNotificationStore((s) => s.banner);
  const clearBanner = useNotificationStore((s) => s.clearBanner);

  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!banner) return;

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -150,
          duration: 250,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        clearBanner();
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, [banner]);

  if (!banner) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          marginTop: insets.top + 8,
          backgroundColor: Colors.background,
          borderColor: Colors.border,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Pressable
      onPress={() => {
    clearBanner();

    handleNotificationNavigation(banner);
}}
      >
        <Text
          style={[
            styles.title,
            {
              color: Colors.text,
            },
          ]}
        >
          {banner.notification?.title}
        </Text>

        <Text
          style={[
            styles.body,
            {
              color: Colors.textSecondary,
            },
          ]}
        >
          {banner.notification?.body}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    left: scale(16),
    right: scale(16),

    zIndex: 9999,

    borderRadius: scale(16),

    borderWidth: 1,

    padding: scale(16),

    elevation: scale(10),
  },

  title: {
    fontFamily: Fonts.brandSemiBold,
    fontSize: normalize(16),
    marginBottom: scale(4),
  },

  body: {
    fontFamily: Fonts.brandRegular,
    fontSize: normalize(14),
  },
});