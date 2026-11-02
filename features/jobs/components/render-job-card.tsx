import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import AcceptButton from './accept-button';
import ConfirmRequest from './confirm-job-request';

export default function RenderJobCard({ item }: { item: any }) {
  const [showConfirmRequestModal, setShowConfirmRequestModal] =
    useState<boolean>(false);

  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  // const [selectedOrder, setSelectedOrder] = useState<any>(null);

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

  const handleAcceptOrder = useCallback((orderId: string, _amount: number) => {
    setSelectedOrderId(orderId);
    // setSelectedOrder(item);
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
        // selectedOrder={selectedOrder}
      />

      <Pressable
        onPress={() => handleViewOrderDetails(item.order_id)}
        style={({ pressed }) => [styles.jobCard, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`Job from ${item.store_name ?? 'store'}`}
      >
        {/* Header Block: Brand Meta & Target Payout */}
        <View style={styles.jobHeader}>
          <View style={styles.storeProfileRow}>
            {item.store_logo ? (
              <Image
                source={{ uri: item.store_logo }}
                style={styles.storeLogo}
              />
            ) : (
              <View style={[styles.storeLogo, styles.storeLogoPlaceholder]}>
                <Ionicons
                  name="storefront-outline"
                  size={18}
                  color={Colors.primary}
                />
              </View>
            )}
            <View style={styles.storeInfoText}>
              <ThemedText style={styles.storeNameText} numberOfLines={1}>
                {item.store_name}
              </ThemedText>
              <ThemedText
                style={styles.orderNumberText}
                themeColor="textMuted"
                numberOfLines={1}
              >
                #
                {item.order_number?.split('-')[1] ||
                  item.order_id.slice(0, 8).toUpperCase()}
              </ThemedText>
            </View>
          </View>
          {/* <Text style={[styles.jobPrice, { color: Colors.primary }]}>
            ₦ {(item.total_amount || 0).toLocaleString()}
          </Text> */}
        </View>

        <View style={styles.divider} />

        {/* Dispatch Route Roadmap Segment */}
        <View style={styles.timeline}>
          <View style={styles.timelineColumn}>
            <View style={[styles.dot, { backgroundColor: Colors.success }]} />
            <View style={styles.connector} />
            <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
          </View>

          <View style={styles.timelineContent}>
            <View style={styles.locationBlock}>
              <ThemedText style={styles.routeStageLabel} themeColor="textMuted">
                Pickup from
              </ThemedText>
              <ThemedText style={styles.jobLocationText} numberOfLines={1}>
                {item.pickup_location?.address ||
                  `${item.store_name || 'Store location'}`}
              </ThemedText>
            </View>

            <View style={styles.locationBlock}>
              <ThemedText style={styles.routeStageLabel} themeColor="textMuted">
                Deliver to
              </ThemedText>
              <ThemedText style={styles.jobLocationText} numberOfLines={1}>
                {item.dropoff_location?.address || 'Customer Address'},{' '}
                {item.dropoff_location?.city || ''}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Context Chip Rows */}
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons
              name="location-outline"
              size={14}
              color={Colors.textSecondary}
            />
            <ThemedText style={styles.jobMetaText} themeColor="textSecondary">
              {distanceKm}
            </ThemedText>
          </View>

          <View style={styles.metaChip}>
            <Ionicons
              name="cube-outline"
              size={14}
              color={Colors.textSecondary}
            />
            <ThemedText style={styles.jobMetaText} themeColor="textSecondary">
              {totalItemsCount} items
            </ThemedText>
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

          <AcceptButton
            amount={item.deliveryFee}
            onPress={() => handleAcceptOrder(item.order_id, item.total_amount)}
            style={styles.btnPrimary}
          />
        </View>
      </Pressable>
    </>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    jobCard: {
      backgroundColor: Colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      overflow: 'hidden',
    },

    pressed: {
      backgroundColor: Colors.backgroundSecondary,
    },

    jobHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 14,
    },

    storeProfileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      marginRight: Spacing.two,
    },

    storeLogo: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: Colors.backgroundTertiary,
    },

    storeLogoPlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primaryExtraLight,
    },

    storeInfoText: {
      flex: 1,
      justifyContent: 'center',
      gap: Spacing.half,
    },

    storeNameText: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
      textTransform: 'capitalize',
    },

    orderNumberText: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    jobPrice: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
    },

    timeline: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 14,
      paddingTop: 14,
    },

    timelineColumn: {
      width: 10,
      alignItems: 'center',
      paddingVertical: 6,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 999,
    },

    connector: {
      width: 1.5,
      flex: 1,
      minHeight: 28,
      backgroundColor: Colors.border,
      marginVertical: Spacing.one,
    },

    timelineContent: {
      flex: 1,
      gap: 12,
    },

    locationBlock: {
      gap: Spacing.half,
    },

    routeStageLabel: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },

    jobLocationText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
      textTransform: 'capitalize',
    },

    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.two,
      paddingHorizontal: 14,
      paddingTop: 14,
    },

    metaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: Colors.backgroundTertiary,
    },

    jobMetaText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 17,
    },

    jobActions: {
      flexDirection: 'row',
      gap: Spacing.two,
      padding: 14,
    },

    btnPrimary: {
      flex: 1,
    },
  });
