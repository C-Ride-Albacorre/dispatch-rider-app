


import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { scale } from '@/utils/scaling';
import { create } from 'axios';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function AuthPageHeader() {

  const {Colors} = useTheme()

  const styles = createStyles(Colors);
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/c-ride.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.title}>Begin your journey with care</Text>
    </View>
  );
}

const createStyles = (Colors: any) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: scale(80),
    height: scale(48),
  },

  title: {
    fontFamily: Fonts.brandMedium,
    fontSize: 16,
    color: Colors.textSecondary,
  },
});