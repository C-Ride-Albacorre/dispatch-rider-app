import Button from '@/components/ui/buttons/button';
import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { scale, verticalScale } from '@/utils/scaling';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const openWebBrowser = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn("Can't open URL:", url);
    }
  };

  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = createStyles(Colors);

  return (
    // Scrollable so short screens can still reach the terms text
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/rider-image.jpg')}
          style={styles.bgImage}
          resizeMode="cover"
        />
        {/* GRADIENT */}
        <LinearGradient
          colors={['transparent', `${Colors.background}CC`, Colors.background]}
          locations={[0, 0.6, 1]}
          style={styles.gradient}
        />
      </View>

      <View
        style={[
          styles.contentContainer,
          // Keep the terms text above the Android navigation bar / iOS home indicator
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={{ width: '100%' }}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Animated.Text entering={FadeInDown} style={styles.tagline}>
              <Text>Beyond Rides, We Deliver Experiences</Text>
            </Animated.Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Animated.View entering={FadeInDown.delay(100)}>
              <Link href={'/register'} asChild>
                <Button size="lg" variant="outline">
                  Become a Rider
                </Button>
              </Link>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)}>
              <Link href={'/login'} asChild>
                <Button size="lg" variant="primary">
                  Login
                </Button>
              </Link>
            </Animated.View>

            {/* Privacy */}
            <Animated.Text
              entering={FadeInDown.delay(400)}
              style={styles.privacy}
            >
              <Text>
                By continuing, you agree to our{' '}
                <Text
                  onPress={() => openWebBrowser('https://c-ride.co/terms')}
                  style={styles.link}
                >
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                  onPress={() => openWebBrowser('https://c-ride.co/privacy')}
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
    </ScrollView>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    scrollContent: {
      flexGrow: 1,
    },

    bgImage: {
      width: '100%',
      height: '100%',
      transform: [{ scale: 1.01 }],
    },

    // Takes whatever height the content leaves over, but never collapses on
    // short screens; past this minimum the page scrolls instead
    imageContainer: {
      flexGrow: 1,
      minHeight: verticalScale(220),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },

    gradient: {
      position: 'absolute',
      height: 200,
      left: 0,
      bottom: -1,
      right: 0,
    },

    logo: {
      width: scale(64),
      height: scale(64),
      marginBottom: scale(20),
    },

    contentContainer: {
      alignItems: 'center',
      paddingHorizontal: 30,
      paddingTop: 20,
    },

    tagline: {
      fontSize: 32,
      fontFamily: Fonts.brandBold,
      textAlign: 'center',
      marginBottom: verticalScale(40),
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
      color: Colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },

    link: {
      color: Colors.primary,
      textDecorationLine: 'underline',
      fontFamily: Fonts.brandMedium,
    },
  });
