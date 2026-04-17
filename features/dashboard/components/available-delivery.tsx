import Button from '@/components/ui/buttons/button';
import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function AvailableDelivery() {
  return (
    <View style={styles.availableContainer}>
      <View style={styles.availableHeader}>
        <View style={styles.deliveryId}>
          <Text style={styles.deliveryIdText}>CR-2847</Text>

          <Text style={styles.deliveryTypeText}>express</Text>
        </View>

        <Text style={styles.deliveryAmountText}>NGN 4500</Text>
      </View>

      <View style={styles.deliveryInfo}>
        <View style={styles.deliveryRoute}>
          <View style={styles.routeIcon}>
            <Ionicons
              name="navigate-outline"
              size={20}
              color={Colors.primary}
            />
          </View>

          <View style={styles.routeDetails}>
            <Text style={styles.routeLabel}>Pickup</Text>
            <Text style={styles.routeAddress}>123 Main St, Lagos</Text>
          </View>
        </View>

        <View style={styles.deliveryRoute}>
          <View style={styles.routeIcon}>
            <Ionicons
              name="location-outline"
              size={20}
              color={Colors.primary}
            />
          </View>

          <View style={styles.routeDetails}>
            <Text style={styles.routeLabel}>Dropoff</Text>
            <Text style={styles.routeAddress}>456 Elm St, Lagos</Text>
          </View>
        </View>
      </View>

      <View style={styles.deliveryDetailContainer}>
        <View style={styles.deliveryDetailItem}>
          <View style={styles.deliveryDetailLabel}>
            <Ionicons name="bicycle-outline" size={16} color={Colors.primary} />
            <Text>Distance</Text>
          </View>

          <Text style={styles.deliveryDetailValue}>5.2 km</Text>
        </View>

        <View style={styles.deliveryDetailItem}>
          <View style={styles.deliveryDetailLabel}>
            <Ionicons name="cube-outline" size={16} color={Colors.primary} />
            <Text style={styles.deliveryDetailLabelText}>Items</Text>
          </View>

          <Text style={styles.deliveryDetailValue}>2 Items</Text>
        </View>

        <View style={styles.deliveryDetailItem}>
          <View style={styles.deliveryDetailLabel}>
            <Ionicons name="time-outline" size={16} color={Colors.primary} />
            <Text style={styles.deliveryDetailLabelText}>Time Slot</Text>
          </View>

          <Text style={styles.deliveryDetailValue}>10:00 AM - 12:00 PM</Text>
        </View>
      </View>

      <View>
        <View style={styles.deliveryItems}>
          <Text style={styles.itemsLabel}>Items</Text>
          <View style={styles.itemsList}>
            <View style={styles.item}>
              <Image
                source={require('@/assets/images/item.jpg')}
                style={styles.itemImage}
              />

              <Text style={styles.itemText}> Burger x2</Text>
            </View>

            <View style={styles.item}>
              <Image
                source={require('@/assets/images/item.jpg')}
                style={styles.itemImage}
              />

              <Text style={styles.itemText}> Burger x2</Text>
            </View>
            <View style={styles.item}>
              <Image
                source={require('@/assets/images/item.jpg')}
                style={styles.itemImage}
              />

              <Text style={styles.itemText}> Burger x2</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.availableActions}>
        <View style={styles.actionButtons}>
          <Button
            leftIcon={
              <Ionicons
                name="checkmark-done-outline"
                size={16}
                color={Colors.text}
              />
            }
            variant="green"
          >
            Accept Delivery
          </Button>

          <Button
            leftIcon={
              <Ionicons name="close-outline" size={16} color={Colors.error} />
            }
            variant="redOutline"
          >
            Decline
          </Button>
        </View>

        <Button
          leftIcon={
            <Ionicons name="eye-outline" size={16} color={Colors.text} />
          }
        >
          View Details
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deliveryInfo: {
    gap: 24,
  },

  deliveryRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  routeIcon: {
    width: 44,
    height: 44,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
  },

  routeDetails: {
    gap: 4,
  },

  routeLabel: {
    fontSize: 12,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  routeAddress: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },

  deliveryItems: {
    gap: 8,
  },

  itemsLabel: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  itemsList: {
    gap: 16,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    objectFit: 'cover',
  },

  itemText: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },

  availableContainer: {
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

  availableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  deliveryId: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  deliveryIdText: {
    fontSize: 12,
    fontFamily: Fonts.brandMedium,
    color: Colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: Colors.success,
    borderRadius: 25,
  },

  deliveryTypeText: {
    fontSize: 12,
    fontFamily: Fonts.brandMedium,
    color: Colors.error,
    textTransform: 'capitalize',
  },

  deliveryAmountText: {
    fontSize: 16,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.primary,
  },

  deliveryDetailContainer: {
    gap: 24,
  },

  deliveryDetailItem: {
    gap: 6,
  },

  deliveryDetailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  deliveryDetailValue: {
    fontSize: 16,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },
  deliveryDetailLabelText: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  availableActions: {
    gap: 12,
  },

  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
