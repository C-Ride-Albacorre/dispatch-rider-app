import { Colors, Fonts } from '@/constants/theme';
import { Image, StyleSheet, Text } from 'react-native';
import { View } from 'react-native';

export default function AuthPageHeader() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/c-ride.png')} style={styles.icon} />

      <Text style={styles.title}>Begin your journey with care</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 80,
    height: 48,
    objectFit: 'contain',
  },

  title: {
    fontFamily: Fonts.brandMedium,
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
