import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

/** Empty state for the recent deliveries list */
export default function NoRecentDelivery() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.empty}>
      <View style={styles.iconCircle}>
        <Ionicons name="cube-outline" size={20} color={Colors.textMuted} />
      </View>

      <ThemedText style={styles.title}>No recent deliveries</ThemedText>

      <ThemedText style={styles.message} themeColor="textMuted">
        You have no recent deliveries at the moment. Check back later for
        updates on your delivery history!
      </ThemedText>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    empty: {
      alignItems: 'center',
      gap: Spacing.two,
      paddingVertical: Spacing.five,
      paddingHorizontal: Spacing.four,
    },

    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.backgroundTertiary,
      marginBottom: Spacing.one,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    message: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
    },
  });
