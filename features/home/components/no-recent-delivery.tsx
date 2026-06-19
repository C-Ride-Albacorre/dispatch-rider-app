import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NoRecentDelivery() {
  const { Colors, isDark } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.noDeliveryContainer}>
      <Ionicons name="cube-outline" size={32} color={Colors.textSecondary} />

      <Text style={styles.title}> 
  No Recent Deliveries
      </Text>

      <Text style={styles.message}>
        You have no recent deliveries at the moment. Check back later for updates on your delivery history!
      </Text>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    noDeliveryContainer: {
      paddingVertical: scale(24),
      paddingHorizontal: scale(16),

      borderRadius: scale(12),
      alignItems: 'center',
      gap: scale(14),
    },
    title: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
    },
    message: {
      fontSize: normalize(12),
      color: Colors.textSecondary,
      fontFamily: Fonts.brandRegular,
      textAlign: 'center',
    },
  });
