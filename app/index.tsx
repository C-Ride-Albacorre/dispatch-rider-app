import { scale } from '@/utils/scaling';

import { router } from 'expo-router';

import { useEffect, useRef } from 'react';

import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';

export default function Home() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

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
      const {
        authStatus,
        verificationToken,
        onboardingStatus,
        onboardingStep,
      } = useAuthStore.getState();

      if (authStatus === 'AUTHENTICATED') {
        if (onboardingStatus !== 'COMPLETED') {
          const completedStep = Number(onboardingStep ?? 0);
          router.replace(
            `/(app)/(protected)/onboarding?step=${completedStep + 1}&resumeStep=${completedStep}`,
          );
          return;
        }

        router.replace('/(app)/(protected)/(tabs)/home');
        return;
      }

      if (authStatus === 'VERIFYING') {
        const { isEmailVerified, isPhoneVerified } = useAuthStore.getState();

        // Case 1: only email done → go phone
        if (isEmailVerified && !isPhoneVerified && verificationToken) {
          router.replace('/(app)/(verify)/phone');
          return;
        }

        // Case 2: only phone done → go email
        if (isPhoneVerified && !isEmailVerified && verificationToken) {
          router.replace('/(app)/(verify)/email');
          return;
        }

        // Case 3: nothing done → start flow
        if (verificationToken) {
          router.replace('/(app)/(verify)/email');
          return;
        }
      }

      router.replace('/(public)');
    });
  }, []);
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logo,
          { opacity, transform: [{ scale: scaleAnim }, { translateY }] },
        ]}
      >
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      justifyContent: 'center',
    },

    logo: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    image: {
      width: scale(128),
      height: scale(128),
    },
  });
