import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { Image, StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

// Must match the expo-splash-screen plugin config in app.json so the swap
// from the native splash to this screen is seamless.
const SPLASH_IMAGE = require('@/assets/images/splash-icon.png');
const SPLASH_IMAGE_WIDTH = 200;
const SPLASH_BACKGROUND = { light: '#ffffff', dark: '#000000' };

type AnimatedSplashProps = {
  ready: boolean;
  onFinish: () => void;
};

/**
 * Takes over from the native splash screen and gently pulses the logo while
 * the app loads, then fades out as soon as `ready` is true.
 */
export default function AnimatedSplash({ ready, onFinish }: AnimatedSplashProps) {
  const colorScheme = useColorScheme();

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const nativeSplashHidden = useRef(false);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, []);

  useEffect(() => {
    if (!ready) return;

    cancelAnimation(scale);
    scale.value = withTiming(1.15, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        scheduleOnRN(onFinish);
      }
    });
  }, [ready]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const hideNativeSplash = () => {
    if (nativeSplashHidden.current) return;
    nativeSplashHidden.current = true;

    SplashScreen.hideAsync();
  };

  return (
    <Animated.View
      pointerEvents={ready ? 'none' : 'auto'}
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === 'dark'
              ? SPLASH_BACKGROUND.dark
              : SPLASH_BACKGROUND.light,
        },
        containerStyle,
      ]}
      onLayout={hideNativeSplash}
    >
      <Animated.View style={logoStyle}>
        <Image
          source={SPLASH_IMAGE}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    elevation: 999,
  },

  logo: {
    width: SPLASH_IMAGE_WIDTH,
    height: SPLASH_IMAGE_WIDTH,
  },
});
