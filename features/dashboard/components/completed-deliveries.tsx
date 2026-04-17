import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

export default function CompletedDeliveries() {
  return (
    <View style={styles.completedDeliveries}>
      <View style={styles.completedHeader}>
        <Text style={styles.completedHeaderText}>
          Todays Completed Deliveries
        </Text>

        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>This Week</Text>
        </View>
      </View>

      <View style={styles.completedList}>
        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryIdContainer}>
            <Text style={styles.deliveryIdText}>CR-2847</Text>
            <View style={styles.deliveryStatus}>
              <Ionicons
                name="checkmark-done-outline"
                size={16}
                color={Colors.success}
              />
              <Text style={styles.deliveryStatusText}>Delivered</Text>
            </View>
          </View>

          <Text style={styles.deliveryTimeText}>18 mins ago</Text>
        </View>

        <View style={styles.customerDetails}>
          <Text style={styles.customerLabel}>Customer</Text>

          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>Funke Adeleke</Text>

            <Text style={styles.customerEmail}>funkeakindele@gmail.com</Text>
            <Text style={styles.customerPhone}>08012345678</Text>
          </View>
        </View>

        <View style={styles.earningsInfo}>
          <Text style={styles.earningsAmount}>NGN 6500</Text>

          <View style={styles.earningsDetails}>
            <View style={styles.rating}>
              <Ionicons name="cash" size={16} color={Colors.primary} />
              <Text style={styles.ratingText}> ₦1,000 tip</Text>
            </View>

            <View style={styles.rating}>
              <Ionicons name="star" size={16} color={Colors.primary} />
              <Text style={styles.ratingText}>5.0</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  completedDeliveries: {
    gap: 16,
  },

  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  completedHeaderText: {
    fontSize: 16,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
  },

  filterText: {
    fontSize: 12,
    fontFamily: Fonts.brandMedium,
    color: Colors.textSecondary,
  },

  completedList: {
    gap: 32,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 16,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  deliveryIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  deliveryIdText: {
    fontSize: 12,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: Colors.primary,
    borderRadius: 25,
  },

  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  deliveryStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successExtraLight,

    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },

  deliveryStatusText: {
    fontSize: 12,
    fontFamily: Fonts.brandMedium,
    color: Colors.success,
  },

  deliveryTimeText: {
    fontSize: 12,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  customerLabel: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  customerInfo: {
    gap: 4,
  },

  customerName: {
    fontSize: 16,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },

  customerEmail: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  customerPhone: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  customerDetails: {
    gap: 4,
  },

  earningsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  earningsAmount: {
    fontSize: 16,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.primary,
  },

  earningsDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.success,
  },

  tipText: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.success,
  },
});
