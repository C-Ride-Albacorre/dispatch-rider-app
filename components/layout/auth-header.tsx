import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { Image, StyleSheet, View } from 'react-native';

type AuthPageHeaderProps = {
  title?: string;
  subtitle?: React.ReactNode;
};

export default function AuthPageHeader({
  title,
  subtitle = 'Begin your journey with care',
}: AuthPageHeaderProps) {
  return (
    <View style={styles.hero}>
      <Image
        source={require('@/assets/images/splash-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {!!title && <ThemedText style={styles.title}>{title}</ThemedText>}
      {!!subtitle && (
        <ThemedText style={styles.subtitle} themeColor="textMuted">
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: Spacing.one,
  },

  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.two,
  },

  title: {
    fontFamily: Fonts.brandSemiBold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.3,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: Fonts.brandRegular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
