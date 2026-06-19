import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { set } from 'zod';
import ConfirmRequest from './confirm-job-request';

export default function RenderJobCard({ item }: { item: any }) {
const[showConfirmRequestModal, setShowConfirmRequestModal] = useState<boolean>(false);

const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const router = useRouter();

  // Action Handlers
  const handleViewOrderDetails = useCallback(
    (orderId: string) => {
      router.push(`/jobs/${orderId}`);
    },
    [router],
  );

  const handleAcceptOrder = useCallback((orderId: string, amount: number) => {
    console.log(`Accepting order ${orderId} for ₦${amount}`);

    setSelectedOrderId(orderId);
    setShowConfirmRequestModal(true);

  }, []);

  // Total number of discrete products ordered
  const totalItemsCount =
    item.items?.reduce(
      (acc: number, curr: any) => acc + (curr.quantity || 1),
      0,
    ) || 0;

  // Parse approximate distance to string value
  const distanceKm = item.distance_meters
    ? `${(item.distance_meters / 1000).toFixed(2)} km`
    : 'Nearby';

  return (

    <>

    <ConfirmRequest
      showConfirmRequestModal={showConfirmRequestModal}
      setShowConfirmRequestModal={setShowConfirmRequestModal}
      selectedOrderId={selectedOrderId}
    />

      <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleViewOrderDetails(item.order_id)}
      style={styles.jobCard}
    >
      {/* Header Block: Brand Meta & Target Payout */}
      <View style={styles.jobHeader}>
        <View style={styles.storeProfileRow}>
          {item.store_logo ? (
            <Image source={{ uri: item.store_logo }} style={styles.storeLogo} />
          ) : (
            <View
              style={[
                styles.storeLogoPlaceholder,
                { backgroundColor: Colors.primaryLight },
              ]}
            />
          )}
          <View style={styles.storeInfoText}>
            <Text style={styles.storeNameText} numberOfLines={1}>
              {item.store_name}
            </Text>
            <Text style={styles.orderNumberText} numberOfLines={1}>
              {item.order_number?.split('-')[1] ||
                item.order_id.slice(0, 8).toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={[styles.jobPrice, { color: Colors.primary }]}>
          NGN {(item.total_amount || 0).toLocaleString()}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Dispatch Route Roadmap Segment */}
      <View style={styles.timeline}>
        <View style={styles.timelineColumn}>
          <View style={[styles.dot, { backgroundColor: Colors.success }]} />
          <View style={styles.connector} />
          <View style={[styles.dot, { backgroundColor: '#E2E8F0' }]} />
        </View>

        <View style={styles.timelineContent}>
          <View style={styles.locationBlock}>
            <Text style={styles.routeStageLabel}>PICKUP FROM</Text>
            <Text style={styles.jobLocationText} numberOfLines={1}>
              {item.pickup_location?.address ||
                `${item.store_name || 'Store location'}`}
            </Text>
          </View>

          <View style={styles.locationBlock}>
            <Text style={styles.routeStageLabel}>DELIVER TO</Text>
            <Text style={styles.jobLocationText} numberOfLines={1}>
              {item.dropoff_location?.address || 'Customer Address'},{' '}
              {item.dropoff_location?.city || ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Context Chip Rows */}
      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Ionicons
            name="location-outline"
            size={14}
            color={Colors.textMuted}
          />
          <Text style={styles.jobMetaText}>{distanceKm}</Text>
        </View>

        <View style={styles.metaChip}>
          <Ionicons name="cube-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.jobMetaText}>{totalItemsCount} items</Text>
        </View>
      </View>

      {/* Immediate Interactive Touch Actions */}
      <View style={styles.jobActions}>
        <Button
          variant="outline"
          onPress={() => handleViewOrderDetails(item.order_id)}
        >
          View Details
        </Button>

        <Button
          variant="primary"
          onPress={() => handleAcceptOrder(item.order_id, item.total_amount)}
          style={styles.btnPrimary}
        >
          Accept • ₦{(item.total_amount || 0).toLocaleString()}
        </Button>
      </View>
    </TouchableOpacity>
    </>
  
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    jobCard: {
      backgroundColor: Colors.background,
      borderRadius: scale(16),
      borderWidth: 1,
      borderColor: Colors.border,
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
    },
    jobHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: scale(14),
    },
    storeProfileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(10),
      flex: 1,
      marginRight: scale(8),
    },
    storeLogo: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(10),
      backgroundColor: Colors.backgroundTertiary,
    },
    storeLogoPlaceholder: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(10),
    },
    storeInfoText: {
      flex: 1,
      justifyContent: 'center',
    },
    storeNameText: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
      textTransform: 'capitalize',
    },
    orderNumberText: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandRegular,
      color: '#718096',
      marginTop: scale(1),
    },
    jobPrice: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandSemiBold,
    },
    divider: {
      height: 1,
      backgroundColor: Colors.border,
    },
    timeline: {
      flexDirection: 'row',
      gap: scale(12),
      paddingHorizontal: scale(14),
      paddingTop: scale(14),
    },
    timelineColumn: {
      width: scale(10),
      alignItems: 'center',
      paddingVertical: scale(4),
    },
    dot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
    },
    connector: {
      width: scale(1.5),
      flex: 1,
      minHeight: scale(32),
      backgroundColor: Colors.border,
      marginVertical: scale(4),
    },
    timelineContent: {
      flex: 1,
      gap: scale(14),
    },
    locationBlock: {
      gap: scale(2),
    },
    routeStageLabel: {
      fontSize: normalize(9),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.textMuted,
      letterSpacing: 0.5,
    },
    jobLocationText: {
      fontSize: normalize(13),
      color: Colors.textSecondary,
      fontFamily: Fonts.brandMedium,
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: scale(8),
      paddingHorizontal: scale(14),
      paddingTop: scale(14),
    },
    metaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(4),
      paddingHorizontal: scale(10),
      paddingVertical: scale(5),
      borderRadius: scale(8),
      backgroundColor: Colors.inputBackground,
    },
    jobMetaText: {
      fontSize: normalize(12),
      color: Colors.textSecondary,
      fontFamily: Fonts.brandMedium,
    },
    jobActions: {
      flexDirection: 'row',
      gap: scale(8),
      padding: scale(14),
    },
    btnPrimary: {
      flex: 1,
    },
  });
