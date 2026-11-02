import { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useNotificationStore } from '@/store/notification-store';
import { handleNotificationNavigation } from '@/utils/notification-navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationBanner() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

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
          marginTop: insets.top + Spacing.two,
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
        style={({ pressed }) => [styles.content, pressed && styles.pressed]}
      >
        <View style={styles.iconWrapper}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.icon}
          />
        </View>

        <View style={styles.text}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {banner.notification?.title?.toLowerCase()}
          </ThemedText>

          <ThemedText
            style={styles.body}
            themeColor="textSecondary"
            numberOfLines={2}
          >
            {banner.notification?.body}
          </ThemedText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      left: Spacing.three,
      right: Spacing.three,
      zIndex: 9999,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
      elevation: 10,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },

    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
    },

    pressed: {
      backgroundColor: Colors.backgroundSecondary,
    },

    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: Colors.backgroundTertiary,
    },

    icon: {
      width: 36,
      height: 36,
    },

    text: {
      flex: 1,
      gap: 2,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
      textTransform: 'capitalize',
    },

    body: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },
  });
