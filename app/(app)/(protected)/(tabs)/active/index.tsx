
import { HEADER_HEIGHT, useScrollHeader } from '@/components/layout/scroll-header-context';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function  ActiveDeliveryContent() {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

    const insets = useSafeAreaInsets()

    const scrollHandler = useScrollHeader();
  

  return (
     <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
           contentContainerStyle={{ paddingTop: HEADER_HEIGHT + insets.top }}
        >
    <View style={styles.container}>
      {/* 1. Map Canvas Section */}
      <View style={styles.mapContainer}>
        {/* Mock Grid/Map background placeholder */}
        <View style={styles.mockMapBackground}>
          <View
            style={[
              styles.mapDot,
              styles.pickupDot,
              { left: '15%', bottom: '20%' },
            ]}
          >
            <View style={styles.pulseInner} />
          </View>
          <Text style={[styles.mapLabel, { left: '22%', bottom: '19%' }]}>
            Pickup
          </Text>

          {/* Connected Route Indicator Line */}
          <View style={styles.routeLinePlaceholder} />

          <View
            style={[
              styles.mapDot,
              styles.dropoffDot,
              { right: '15%', top: '25%' },
            ]}
          />
          <Text style={[styles.mapLabel, { right: '22%', top: '24%' }]}>
            Drop-off
          </Text>

          {/* Delivery Agent Vector Arrow */}
          <View style={[styles.agentMarker, { left: '45%', top: '45%' }]}>
            <Ionicons name="navigate-outline" size={scale(18)} color="#FFFFFF" />
          </View>
        </View>

        {/* Floating ETA Tag */}
        <View style={styles.etaContainer}>
          <Text style={styles.etaText}>ETA 12 mins</Text>
        </View>
      </View>

      {/* 2. Linear Step Indicator Progress Bar */}
      <View style={styles.progressCard}>
        <View style={styles.stepRow}>
          {/* Step 1 */}
          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepCheckCircle,
                { backgroundColor: Colors.success },
              ]}
            >
              <Ionicons name="checkmark" size={scale(12)} color="#FFFFFF" />
            </View>
            <Text
              style={[
                styles.stepTextLabel,
                { color: Colors.success, fontFamily: Fonts.brandMedium },
              ]}
            >
              Heading to Pickup
            </Text>
          </View>

          <View
            style={[styles.stepLine, { backgroundColor: Colors.success }]}
          />

          {/* Step 2 */}
          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepCheckCircle,
                { backgroundColor: Colors.success },
              ]}
            >
              <Ionicons name="checkmark" size={scale(12)} color="#FFFFFF" />
            </View>
            <Text
              style={[
                styles.stepTextLabel,
                { color: Colors.success, fontFamily: Fonts.brandMedium },
              ]}
            >
              At Pickup
            </Text>
          </View>

          <View
            style={[styles.stepLine, { backgroundColor: Colors.success }]}
          />

          {/* Step 3 */}
          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepCheckCircle,
                {
                  borderColor: Colors.success,
                  borderWidth: 2,
                  backgroundColor: '#FFFFFF',
                },
              ]}
            >
              <View
                style={[
                  styles.innerActiveDot,
                  { backgroundColor: Colors.success },
                ]}
              />
            </View>
            <Text
              style={[
                styles.stepTextLabel,
                { color: Colors.success, fontFamily: Fonts.brandSemiBold },
              ]}
            >
              On the Way
            </Text>
          </View>

          <View style={[styles.stepLine, { backgroundColor: Colors.border }]} />

          {/* Step 4 */}
          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepCheckCircle,
                { backgroundColor: Colors.textMuted + '40' },
              ]}
            >
              <View
                style={[
                  styles.innerActiveDot,
                  { backgroundColor: Colors.textMuted },
                ]}
              />
            </View>
            <Text
              style={[
                styles.stepTextLabel,
                { color: Colors.textMuted, fontFamily: Fonts.brandRegular },
              ]}
            >
              Delivered
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Customer & Address Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.customerHeaderRow}>
          <View>
            <Text style={styles.metaLabelText}>Customer</Text>
            <Text style={styles.customerNameText}>Chioma Okafor</Text>
          </View>
          <TouchableOpacity
            style={[styles.phoneButton, { backgroundColor: Colors.success }]}
          >
            <Ionicons name="call" size={scale(20)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.addressesContainerRow}>
          <View
            style={[
              styles.addressBlock,
              { backgroundColor: Colors.backgroundSecondary ?? '#F8F9FA' },
            ]}
          >
            <Text style={styles.addressTypeLabel}>Pickup</Text>
            <Text style={styles.addressValueText} numberOfLines={2}>
              Terra Kulture, Victoria Island
            </Text>
          </View>

          <View
            style={[
              styles.addressBlock,
              { backgroundColor: Colors.backgroundSecondary ?? '#F8F9FA' },
            ]}
          >
            <Text style={styles.addressTypeLabel}>Drop-off</Text>
            <Text style={styles.addressValueText} numberOfLines={2}>
              Plot 22, Ahmadu Bello Way, VI
            </Text>
          </View>
        </View>
      </View>

      {/* 4. Items Summary & Expected Earnings Card */}
      <View style={styles.detailsCard}>
        <View style={styles.itemsEarningsRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.metaLabelText}>Items</Text>
            <Text style={styles.itemsValueText}>Afang Soup, Pounded Yam</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.metaLabelText}>Earning</Text>
            <Text style={[styles.earningValueText, { color: Colors.primary }]}>
              ₦5,500
            </Text>
          </View>
        </View>
      </View>

      {/* 5. Direct Action CTA Buttons */}
      <View style={styles.actionRowContainer}>
        <TouchableOpacity style={[styles.actionBtnBase, styles.navigateBtn]}>
          <Ionicons name="navigate-outline" size={scale(18)} color="#FFFFFF" />
          <Text style={styles.navigateBtnText}>Navigate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtnBase, { backgroundColor: Colors.success }]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={scale(18)}
            color="#FFFFFF"
          />
          <Text style={styles.completeBtnText}>Complete</Text>
        </TouchableOpacity>
      </View>
    </View>
    </Animated.ScrollView>
    
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(16),
      paddingVertical: scale(12),
      gap: scale(12),
    },
    mapContainer: {
      height: scale(220),
      borderRadius: scale(20),
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      backgroundColor: '#EBF8FF',
    },
    mockMapBackground: {
      flex: 1,
      position: 'relative',
    },
    mapDot: {
      width: scale(12),
      height: scale(12),
      borderRadius: scale(6),
      position: 'absolute',
    },
    pickupDot: {
      backgroundColor: '#10B981',
    },
    dropoffDot: {
      backgroundColor: '#F59E0B',
    },
    pulseInner: {
      flex: 1,
      borderRadius: 99,
      backgroundColor: 'rgba(16, 185, 129, 0.4)',
      transform: [{ scale: 1.8 }],
    },
    mapLabel: {
      position: 'absolute',
      fontSize: normalize(11),
      fontFamily: Fonts.brandSemiBold,
      color: '#1E293B',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: scale(6),
      paddingVertical: scale(2),
      borderRadius: scale(6),
    },
    routeLinePlaceholder: {
      position: 'absolute',
      top: '40%',
      left: '20%',
      right: '20%',
      height: scale(3),
      borderStyle: 'dashed',
      borderWidth: 1.5,
      borderColor: '#F59E0B',
    },
    agentMarker: {
      position: 'absolute',
      width: scale(28),
      height: scale(28),
      borderRadius: scale(14),
      backgroundColor: '#0F172A',
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ rotate: '45deg' }],
    },
    etaContainer: {
      position: 'absolute',
      bottom: scale(12),
      right: scale(12),
      backgroundColor: '#FFFFFF',
      paddingHorizontal: scale(12),
      paddingVertical: scale(6),
      borderRadius: scale(12),
      elevation: 2,
    },
    etaText: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandSemiBold,
      color: '#0F172A',
    },
    progressCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: scale(16),
      padding: scale(14),
      borderWidth: 1,
      borderColor: '#EDF2F7',
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    stepItem: {
      alignItems: 'center',
      flex: 1,
    },
    stepCheckCircle: {
      width: scale(20),
      height: scale(20),
      borderRadius: scale(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    innerActiveDot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
    },
    stepTextLabel: {
      fontSize: normalize(9),
      textAlign: 'center',
      marginTop: scale(6),
    },
    stepLine: {
      height: scale(2),
      flex: 0.8,
      marginBottom: scale(14),
    },
    detailsCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: scale(16),
      padding: scale(16),
      borderWidth: 1,
      borderColor: '#EDF2F7',
    },
    customerHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(12),
    },
    metaLabelText: {
      fontSize: normalize(12),
      color: '#718096',
      fontFamily: Fonts.brandRegular,
    },
    customerNameText: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandSemiBold,
      color: '#1A202C',
      marginTop: scale(2),
    },
    phoneButton: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(12),
      justifyContent: 'center',
      alignItems: 'center',
    },
    addressesContainerRow: {
      flexDirection: 'row',
      gap: scale(10),
    },
    addressBlock: {
      flex: 1,
      padding: scale(12),
      borderRadius: scale(12),
    },
    addressTypeLabel: {
      fontSize: normalize(11),
      color: '#A0AEC0',
      fontFamily: Fonts.brandMedium,
      marginBottom: scale(4),
    },
    addressValueText: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandSemiBold,
      color: '#2D3748',
    },
    itemsEarningsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemsValueText: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
      color: '#1A202C',
      marginTop: scale(2),
    },
    earningValueText: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
      marginTop: scale(2),
    },
    actionRowContainer: {
      flexDirection: 'row',
      gap: scale(12),
      marginTop: scale(4),
    },
    actionBtnBase: {
      flex: 1,
      flexDirection: 'row',
      height: scale(48),
      borderRadius: scale(14),
      justifyContent: 'center',
      alignItems: 'center',
      gap: scale(6),
    },
    navigateBtn: {
      backgroundColor: '#1A202C',
    },
    navigateBtnText: {
      color: '#FFFFFF',
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
    },
    completeBtnText: {
      color: '#FFFFFF',
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
    },
  });
