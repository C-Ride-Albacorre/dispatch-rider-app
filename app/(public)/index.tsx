import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Image, Linking, ScrollView, StyleSheet, View } from 'react-native';
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
          { paddingBottom: insets.bottom + Spacing.four },
        ]}
      >
        <View style={styles.hero}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Animated.View entering={FadeInDown}>
            <ThemedText style={styles.tagline}>
              Beyond Rides, We Deliver Experiences
            </ThemedText>
          </Animated.View>
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
          <Animated.View entering={FadeInDown.delay(400)}>
            <ThemedText style={styles.privacy} themeColor="textMuted">
              By continuing, you agree to our{' '}
              <ThemedText
                onPress={() => openWebBrowser('https://c-ride.co/terms')}
                style={styles.link}
                themeColor="primary"
              >
                Terms of Service
              </ThemedText>{' '}
              and{' '}
              <ThemedText
                onPress={() => openWebBrowser('https://c-ride.co/privacy')}
                style={styles.link}
                themeColor="primary"
              >
                Privacy Policy
              </ThemedText>
              .
            </ThemedText>
          </Animated.View>
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
      minHeight: 220,
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

    contentContainer: {
      gap: Spacing.five,
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.three,
    },

    hero: {
      alignItems: 'center',
      gap: Spacing.three,
    },

    logo: {
      width: 64,
      height: 64,
    },

    tagline: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 28,
      lineHeight: 36,
      letterSpacing: -0.4,
      textAlign: 'center',
    },

    buttonContainer: {
      width: '100%',
      gap: Spacing.three,
    },

    privacy: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
      textAlign: 'center',
    },

    link: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 17,
      textDecorationLine: 'underline',
    },
  });
