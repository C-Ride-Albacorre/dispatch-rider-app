import { Fonts } from '@/constants/theme';
import StatusDot from '@/features/active/status-dot';
import { useTheme } from '@/hooks/use-theme';
import { ActiveOrderProps } from '@/store/driver-jobs-store';
import { normalize, scale } from '@/utils/scaling';
import { StyleSheet, Text, View } from 'react-native';

export default function ActiveDelivery({
  activeOrder,
  etaText,
  etaVendor,
  etaCustomer,
  isPickupActive,
  isCustomerActive,
}: {
  activeOrder: ActiveOrderProps;
  etaText: string;
  isPickupActive: boolean;
  isCustomerActive: boolean;
  etaVendor: number | null;
  etaCustomer: number | null;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.routeCard}>
      <Text style={styles.sectionTitle}>Delivery Route</Text>

      {/* Pickup */}
      <View style={styles.timelineItem}>
        <View style={styles.indicator}>
          <StatusDot active={isPickupActive} />
          <View style={styles.timelineLine} />
        </View>

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Pickup</Text>

            {etaVendor != null && (
              <View style={styles.etaContainer}>
                <Text style={styles.etaText}>ETA: {etaText}</Text>
              </View>
            )}
          </View>

          <Text style={styles.title} numberOfLines={1}>{activeOrder.store_name}</Text>

          <Text style={styles.address} numberOfLines={1}>
            {activeOrder.pickup_location.address}
          </Text>
        </View>
      </View>

      {/* Drop-off */}
      <View style={styles.timelineItem}>
        <View style={styles.indicator}>
          <StatusDot active={isCustomerActive} />
        </View>

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Drop-off</Text>

            {etaCustomer != null && (
              <View style={styles.etaContainer}>
                <Text style={styles.etaText}>ETA: {etaCustomer} min</Text>
              </View>
            )}
          </View>

          <Text style={styles.title} numberOfLines={1}>Customer</Text>

          <Text style={styles.address} numberOfLines={1}>
            {activeOrder.dropoff_location.address}
          </Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    routeCard: {
      backgroundColor: Colors.card,
      borderRadius: scale(16),
      padding: scale(16),
      borderWidth: 1,
      borderColor: Colors.border,
      gap: scale(16),
    },

    sectionTitle: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
    },

    timelineItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },

    indicator: {
      width: scale(24),
      alignItems: 'center',
      marginRight: scale(14),
    },

    timelineLine: {
      width: scale(2),
      flex: 1,
      minHeight: scale(70),
      marginTop: scale(6),
      backgroundColor: Colors.border,
    },

    content: {
      flex: 1,
      paddingBottom: scale(24),
    },

    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    label: {
      fontSize: scale(12),
      color: Colors.textMuted,
      fontFamily: Fonts.brandRegular,
    },

    title: {
      marginTop: scale(4),
      fontSize: scale(15),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
      textTransform: 'capitalize',
    },

    address: {
      marginTop: scale(4),
      fontSize: scale(13),
      fontFamily: Fonts.brandRegular,
      color: Colors.textSecondary,
      lineHeight: scale(20),
      textTransform: 'capitalize',
    },

    etaContainer: {
      paddingVertical: scale(4),
      paddingHorizontal: scale(8),
      backgroundColor: Colors.successExtraLight,
      borderRadius: scale(8),
    },

    etaText: {
      fontSize: scale(11),
      fontFamily: Fonts.brandMedium,
      color: Colors.success,
    },
  });
