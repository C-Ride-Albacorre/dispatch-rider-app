import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View, Easing } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export default function Home() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const start = async () => {
      await SplashScreen.hideAsync();

      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
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
        router.replace('/(public)');
      });
    };

    start();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-[#2C3E50]">
      <Animated.View
        style={[
          styles.logo,
          {
            opacity,
            transform: [{ scale }, { translateY }],
          },
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

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 128,
    height: 128,
  },
});
