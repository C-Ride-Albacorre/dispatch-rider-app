import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { formatDate } from '@/helpers/date-formatter';
import { formatNaira } from '@/features/earnings/use-fetch';
import { useTheme } from '@/hooks/use-theme';
import {
  MASKED_AMOUNT,
  useAmountVisibility,
} from '@/store/amount-visibility-store';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { RecentDelivery } from '../use-fetch';

type IconName = keyof typeof Ionicons.glyphMap;

function getStatusDisplay(status: string, Colors: any) {
  switch (status) {
    case 'DELIVERED':
      return {
        label: 'Delivered',
        icon: 'checkmark' as IconName,
        color: Colors.success,
        background: Colors.successExtraLight,
      };
    case 'PICKED_UP':
    case 'IN_TRANSIT':
      return {
        label: 'Picked up',
        icon: 'bicycle' as IconName,
        color: Colors.primary,
        background: Colors.primaryExtraLight,
      };
    case 'CANCELLED':
    case 'DECLINED':
      return {
        label: 'Cancelled',
        icon: 'close' as IconName,
        color: Colors.error,
        background: Colors.errorExtraLight,
      };
    default:
      return {
        label: 'Assigned',
        icon: 'time-outline' as IconName,
        color: Colors.textMuted,
        background: Colors.backgroundTertiary,
      };
  }
}

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

  const statusDisplay = getStatusDisplay(delivery.orderStatus, Colors);

  const amountsHidden = useAmountVisibility((s) => s.hidden);

  return (
    <Pressable
      onPress={onPress}
      key={delivery.assignmentId}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Delivery for ${customerName}`}
    >
      <View
        style={[styles.statusIcon, { backgroundColor: statusDisplay.background }]}
      >
        <Ionicons
          name={statusDisplay.icon}
          size={18}
          color={statusDisplay.color}
        />
      </View>

      <View style={styles.customerDetails}>
        <ThemedText
          style={styles.customerName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {customerName.length > 24
            ? `${customerName.slice(0, 24)}...`
            : customerName}
        </ThemedText>

        <ThemedText style={styles.secondary} themeColor="textSecondary">
          {delivery.orderNumber.length > 24
            ? `${delivery.orderNumber.slice(0, 24)}...`
            : delivery.orderNumber}
        </ThemedText>

        <ThemedText style={styles.meta} themeColor="textMuted">
          {statusDisplay.label} ·{' '}
          {formatDate(delivery.deliveredAt ?? delivery.createdAt)}
        </ThemedText>
      </View>

      <ThemedText style={styles.amount}>
        {amountsHidden ? MASKED_AMOUNT : formatNaira(delivery.deliveryFee)}
      </ThemedText>
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
