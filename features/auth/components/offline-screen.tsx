import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts, Spacing } from '@/constants/theme';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
  onRetry?: () => void;
};

export default function OfflineScreen({ onRetry }: Props) {

  const [loading, setLoading] = useState(false);

  async function handleRetry() {
    if (!onRetry) return;

    try {
      setLoading(true);
      await onRetry();
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      {/* Illustration */}
      <Image
        source={require('@/assets/images/offline.png')}
        style={styles.illustration}
      />

      <View style={styles.text}>
        {/* Title */}
        <ThemedText style={styles.title}>You're Offline</ThemedText>

        {/* Description */}
        <ThemedText style={styles.description} themeColor="textMuted">
          We can't connect to the internet right now. Check your connection to
          continue receiving deliveries and route updates.
        </ThemedText>
      </View>

      {/* <Button size="lg" style={styles.btn} onPress={handleRetry} loading={loading}>
        Try Again
      </Button> */}

      <ThemedText style={styles.footer} themeColor="textMuted">
        Last checked: Just now
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
  },

  illustration: {
    width: 150,
    height: 150,
  },

  text: {
    alignItems: 'center',
    gap: Spacing.two,
  },

  btn: {
    alignSelf: 'stretch',
  },

  title: {
    fontFamily: Fonts.brandSemiBold,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },

  description: {
    fontFamily: Fonts.brandRegular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  footer: {
    fontFamily: Fonts.brandRegular,
    fontSize: 12,
    lineHeight: 17,
  },
});
