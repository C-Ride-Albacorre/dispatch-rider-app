import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function ActiveDelivery() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);
  return (
    <View style={styles.activeDeliveryContainer}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="bicycle-outline" size={16} color={Colors.success} />
          <Text style={styles.activeDeliveryText}>Active Delivery</Text>
        </View>

        <Text style={styles.deliveryIdText}>#CR-2846</Text>
      </View>

      <View style={styles.deliveryInfoContainer}>
        <View style={styles.deliveryAddresses}>
          <View style={styles.addressContainer}>
            <Text style={styles.labelText}>From</Text>

            <Text style={styles.addressText}>
              Terra Kulture, Victoria Island
            </Text>
          </View>

          <Ionicons
            name="navigate-outline"
            size={16}
            color={Colors.textSecondary}
          />

          <View style={styles.addressContainer}>
            <Text style={styles.labelText}>To</Text>

            <Text style={styles.addressText}>
              Plot 22, Ahmadu Bello Way, VI
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}></View>
        </View>

        <View style={styles.fareRow}>
          <Text style={styles.etaText}>ETA: 12 mins</Text>

          <Text style={styles.fareText}>NGN 5,500</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    activeDeliveryContainer: {
      padding: scale(16),
      backgroundColor: Colors.background,
      borderLeftWidth: 4,
      borderWidth: 1,
      borderLeftColor: Colors.success,
      borderColor: Colors.border,
      borderRadius: scale(12),
      gap: scale(12),
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(6),
    },

    activeDeliveryText: {
      fontSize: scale(12),
      fontFamily: Fonts.brandRegular,
      color: Colors.text,
    },

    deliveryIdText: {
      fontSize: scale(10),
      fontFamily: Fonts.brandMedium,
      color: Colors.textSecondary,
    },

    deliveryInfoContainer: {
      gap: scale(12),
    },

    deliveryAddresses: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
    },

    addressContainer: {
      flexDirection: 'column',
      gap: scale(4),

      maxWidth: '45%',
    },

    labelText: {
      fontSize: normalize(10),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
    },

    addressText: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandRegular,
      color: Colors.text,
    },

    progressContainer: {
      height: scale(6),
      backgroundColor: Colors.inputBackground,
      borderRadius: scale(3),
      overflow: 'hidden',
    },

    progressBar: {
      width: '60%',
      height: '100%',
      backgroundColor: Colors.success,
      borderRadius: scale(3),
    },

    fareRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    etaText: {
      fontSize: normalize(10),
      fontFamily: Fonts.brandMedium,
      color: Colors.textSecondary,
    },

    fareText: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.primary,
    },
  });
