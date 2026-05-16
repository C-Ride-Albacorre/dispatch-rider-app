// app/index.tsx

import { scale } from '@/utils/scaling';

import { router } from 'expo-router';

import { useEffect, useRef } from 'react';

import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

import { useAuthStore } from '@/store/auth-store';

export default function Home() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(900),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      const { authStatus, verificationToken } = useAuthStore.getState();

      // AUTHENTICATED0

      if (authStatus === 'AUTHENTICATED') {
        router.replace('/(app)/(protected)/dashboard');
        return;
      }

      // VERIFYING

      if (authStatus === 'VERIFYING' && verificationToken) {
        router.replace('/(app)/(verify)/phone');
        return;
      }

      // UNAUTHENTICATED

      router.replace('/(public)');
    });
  }, []);
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-[#2C3E50]">
      {' '}
      <Animated.View
        style={[
          styles.logo,
          { opacity, transform: [{ scale: scaleAnim }, { translateY }] },
        ]}
      >
        {' '}
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.image}
          resizeMode="contain"
        />{' '}
      </Animated.View>{' '}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: scale(128),
    height: scale(128),
  },
});
