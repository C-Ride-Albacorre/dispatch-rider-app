import Button from '@/components/ui/buttons/button';
import { Colors, Fonts } from '@/constants/theme';

import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

export default function Index() {
  const openWebBrowser = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn("Can't open URL:", url);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/rider-image.jpg')}
          style={styles.bgImage}
          resizeMode="cover"
        />
        {/* GRADIENT */}
        <LinearGradient
          colors={['transparent', '#fff']}
          style={{
            position: 'absolute',
            height: 200,
            left: 0,
            bottom: -1,
            right: 0,
          }}
        />
      </View>

      <View style={styles.contentContainer}>
        <View className="items-center w-full gap-8">
          <View className="items-center">
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logo}
            />

            <Animated.Text entering={FadeInDown} style={styles.tagline}>
              Beyond Rides, We Deliver Experiences
            </Animated.Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Animated.View entering={FadeInDown.delay(100)}>
              <Link href={'/register'} asChild>
                <Button variant="outline">Become a Rider</Button>
              </Link>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)}>
              <Link href={'/login'} asChild>
                <Button variant="primary">Login</Button>
              </Link>
            </Animated.View>
          </View>

          {/* Privacy */}
          <Animated.Text
            entering={FadeInDown.delay(400)}
            style={styles.privacy}
          >
            <Text>
              By continuing, you agree to our{' '}
              <Text
                onPress={() => openWebBrowser('https://example.com/terms')}
                style={styles.link}
              >
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text
                onPress={() => openWebBrowser('https://example.com/privacy')}
                style={styles.link}
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  bgImage: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.01 }],
  },

  imageContainer: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

 logo: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginBottom: 20,
  },

  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },

  tagline: {
    fontSize: 32,
    fontFamily: Fonts.brandBold,
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 36,
    color: Colors.text,
  },

  buttonContainer: {
    width: '100%',
    gap: 16,
  },

  privacy: {
    fontFamily: Fonts.brandRegular,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },

  link: {
    color: '#4285F4',
    textDecorationLine: 'underline',
    fontFamily: Fonts.brandSemiBold,
  },
});
