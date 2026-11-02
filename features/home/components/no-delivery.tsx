import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

/** Home's empty state when the rider has nothing in progress */
export default function NoDelivery() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="bicycle-outline" size={20} color={Colors.primary} />
      </View>

      <View style={styles.text}>
        <ThemedText style={styles.title}>No active deliveries</ThemedText>
        <ThemedText style={styles.message} themeColor="textMuted">
          You have no active deliveries at the moment. Check back later for new
          delivery opportunities!
        </ThemedText>
      </View>

      <Button
        size="sm"
        onPress={() => router.push('/(app)/(protected)/(tabs)/jobs')}
        rightIcon={
          <Ionicons
            name="chevron-forward-outline"
            size={16}
            color={Colors.onPrimary}
          />
        }
      >
        Browse jobs
      </Button>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    card: {
      alignItems: 'center',
      gap: 12,
      paddingVertical: Spacing.four,
      paddingHorizontal: Spacing.three,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primaryExtraLight,
    },

    text: {
      alignItems: 'center',
      gap: Spacing.one,
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
