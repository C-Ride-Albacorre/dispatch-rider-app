import Button from '@/components/ui/buttons/button';
import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function DeliveryDetails() {
  return (
    <View style={styles.deliveryDetails}>
      <View style={styles.deliveryHeader}>
        <View style={styles.deliveryStatus}>
          <View style={styles.dot}></View>
          <Text style={styles.statusText}>Active Delivery</Text>
        </View>

        <Text style={styles.deliveryId}>CRD-2024-1234</Text>
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

        <View style={styles.deliveryCustomer}>
          <Text style={styles.customerLabel}>Customer</Text>

          <View style={styles.customerInfo}>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>John Doe</Text>
              <Text style={styles.customerPhone}>+234 800 123 4567</Text>
            </View>

            <Button
              variant="outline"
              leftIcon={
                <Ionicons
                  name="call-outline"
                  size={16}
                  color={Colors.primary}
                />
              }
            >
              Call
            </Button>
          </View>
        </View>

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

        <View style={styles.deliveryEarnings}>
          <Text style={styles.earningsLabel}>Earnings</Text>

          <Text style={styles.earningsAmount}>NGN 3,500</Text>
        </View>

        <View style={styles.deliveryProgress}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Delivery Progress</Text>

            <Text style={styles.etaText}>ETA 12mins</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}></View>
          </View>

          <Text style={styles.etaText}>5 mins to pickup</Text>
        </View>

        <View style={styles.deliveryActions}>
          <Button
            variant="green"
            leftIcon={
              <Ionicons name="navigate-outline" size={16} color={Colors.text} />
            }
          >
            Navigate
          </Button>

          <Button
            variant="primary"
            leftIcon={
              <Ionicons
                name="checkmark-outline"
                size={16}
                color={Colors.text}
              />
            }
          >
            Mark as Delivered
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deliveryDetails: {
    gap: 44,
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

  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  deliveryStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 6,
  },

  statusText: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },

  deliveryId: {
    fontSize: 12,
    fontFamily: Fonts.brandMedium,
    color: Colors.background,
    padding: 4,
    backgroundColor: Colors.success,
    borderRadius: 25,
  },

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

  deliveryCustomer: {
    gap: 2,
  },

  customerLabel: {
    fontSize: 12,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  customerDetails: {
    gap: 4,
  },

  customerName: {
    fontSize: 16,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },

  customerPhone: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
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

  deliveryEarnings: {
    gap: 4,
  },

  earningsLabel: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  earningsAmount: {
    fontSize: 18,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.primary,
  },

  deliveryProgress: {
    gap: 8,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressLabel: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  etaText: {
    fontSize: 14,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
  },

  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
  },

  progressBar: {
    width: '60%',
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },

  deliveryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
