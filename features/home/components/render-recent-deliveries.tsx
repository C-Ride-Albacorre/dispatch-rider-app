import { Fonts } from '@/constants/theme';
import { formatDate } from '@/helpers/date-formatter';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      key={delivery.assignmentId}
      style={styles.deliveriesListItem}
    >
      <View style={styles.statusIcon}>
        <Text style={styles.statusIconText}>✓</Text>
      </View>

      <View style={styles.customerDetails}>
        <Text
          style={styles.customerName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {delivery.customer.firstName + ' ' + delivery.customer.lastName}
        </Text>

        <Text style={styles.orderNumber}>{delivery.orderNumber}</Text>

        <Text style={styles.timeAgo}>{formatDate(delivery.deliveredAt)}</Text>

        {/* <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {Array.from({ length: delivery.rating }).map((_, index) => (
              <Ionicons key={index} name="star" size={12} color="gold" />
            ))}

            {Array.from({ length: 5 - delivery.rating }).map((_, index) => (
              <Ionicons
                key={index}
                name="star-outline"
                size={12}
                color={Colors.textMuted}
              />
            ))}

          
          </View>
        </View> */}
      </View>

      <View style={styles.deliveryFare}>
        <Text style={styles.amount}>₦ {delivery.deliveryFee}</Text>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    deliveriesListItem: {
      gap: scale(12),
      backgroundColor: Colors.inputBackground,
      borderRadius: scale(12),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scale(12),
      paddingVertical: scale(16),
    },

    deliveryItemIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      width: scale(40),
      height: scale(40),
      borderRadius: scale(8),
      backgroundColor: Colors.successExtraLight,
    },

    statusIcon: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.successExtraLight,
    },

    statusIconText: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandBold,
      color: Colors.success,
    },

    customerDetails: {
      flex: 1,
    },

    customerName: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
      textTransform: 'capitalize',
    },

    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
    },

    stars: {
      flexDirection: 'row',
      gap: scale(4),
    },

    timeAgo: {
      fontSize: normalize(10),
      fontFamily: Fonts.brandRegular,
      color: Colors.textMuted,
    },

    deliveryFare: {
      alignItems: 'flex-end',
    },

    amount: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
      color: Colors.primary,
    },

    tip: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandRegular,
      color: Colors.success,
    },
    orderNumber: {
      fontSize: normalize(10),
      fontFamily: Fonts.brandRegular,
      color: Colors.textMuted,
    },
  });
