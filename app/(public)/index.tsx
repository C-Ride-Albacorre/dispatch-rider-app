import { Fonts } from '@/constants/theme';
import AppleButton from '@/features/auth/components/apple-button';
import GoogleButton from '@/features/auth/components/google-button';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

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
    <View className="flex-1 bg-white px-6 py-10 justify-end">
      {/* ALL CONTENT GROUPED AT BOTTOM */}
      <View className="items-center w-full gap-8">
        <View className="items-center">
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <Animated.Text entering={FadeInDown} style={styles.tagline}>
            Beyond Rides, We Deliver Experiences
          </Animated.Text>
        </View>

        {/* Buttons */}
        <View className="w-full mt-8 space-y-4">
          <Animated.View entering={FadeInDown.delay(100)}>
            <AppleButton />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)}>
            <GoogleButton />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)}>
            <TouchableOpacity
              style={styles.otherButton}
              onPress={() => console.log('Other options')}
            >
              <Text style={styles.otherButtonText}>Other Options</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Privacy Text */}
        <Animated.Text entering={FadeInDown.delay(400)} style={styles.privacy}>
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
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },

  tagline: {
    fontFamily: Fonts.brandSemiBold,
    fontSize: 20,
    textAlign: 'center',
  },

  otherButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  otherButtonText: {
    color: '#666666',
    fontSize: 16,
    fontFamily: Fonts.brandMedium,
  },

  privacy: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: '#888',
  },

  link: {
    color: '#1a3652',
    fontFamily: Fonts.brandSemiBold,
  },
});
