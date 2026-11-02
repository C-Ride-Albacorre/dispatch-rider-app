import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { formatDate } from '@/helpers/date-formatter';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { RecentDelivery } from '../use-fetch';

export default function RenderRecentDeliveries({
  delivery,
  onPress,
}: {
  delivery: RecentDelivery;
  onPress?: () => void;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const customerName =
    delivery.customer.firstName + ' ' + delivery.customer.lastName;

  return (
    <Pressable
      onPress={onPress}
      key={delivery.assignmentId}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Delivery for ${customerName}`}
    >
      <View style={styles.statusIcon}>
        <Ionicons name="checkmark" size={18} color={Colors.success} />
      </View>

      <View style={styles.customerDetails}>
        <ThemedText
          style={styles.customerName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {customerName}
        </ThemedText>

        <ThemedText style={styles.secondary} themeColor="textSecondary">
          {delivery.orderNumber}
        </ThemedText>

        <ThemedText style={styles.meta} themeColor="textMuted">
          {formatDate(delivery.deliveredAt)}
        </ThemedText>
      </View>

      <ThemedText style={styles.amount}>₦ {delivery.deliveryFee}</ThemedText>
    </Pressable>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    pressed: {
      backgroundColor: Colors.backgroundSecondary,
    },

    statusIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.successExtraLight,
    },

    customerDetails: {
      flex: 1,
      gap: 2,
    },

    customerName: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
      textTransform: 'capitalize',
    },

    secondary: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    meta: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    amount: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
      marginLeft: Spacing.one,
    },
  });
