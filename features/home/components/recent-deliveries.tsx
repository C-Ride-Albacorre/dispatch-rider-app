import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { Color } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const RECENT_DELIVERIES = [
  {
    id: '1',
    customerName: 'Ibrahim Musa',
    rating: 4,
    timeAgo: '18 mins ago',
    amount: 'NGN 4,200',
    tip: 'NGN 500',
  },

  {
    id: '2',
    customerName: 'Aisha Bello',
    rating: 5,
    timeAgo: '30 mins ago',
    amount: 'NGN 3,800',
    tip: 'NGN 300',
  },

  {
    id: '3',
    customerName: 'John Doe',
    rating: 3,
    timeAgo: '45 mins ago',
    amount: 'NGN 2,500',
    tip: 'NGN 200',
  },
];

export default function RecentDeliveries() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Deliveries</Text>

      {RECENT_DELIVERIES.map((delivery) => (
        <View key={delivery.id} style={styles.deliveriesListItem}>
          <View style={styles.deliveryItemIcon}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={Colors.success}
            />
          </View>

          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{delivery.customerName}</Text>

            <View style={styles.ratingContainer}>
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

              <Text style={styles.timeAgo}>{delivery.timeAgo}</Text>
            </View>
          </View>

          <View style={styles.deliveryFare}>
            <Text style={styles.amount}>{delivery.amount}</Text>

            <Text style={styles.tip}>+{delivery.tip} tip</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      gap: scale(16),
    },

    title: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
    },

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

    customerDetails: {
      flex: 1,
    },

    customerName: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
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
  });
