import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppModal from '@/components/layout/app-modal';
import IconButton from '@/components/ui/buttons/icon-button';
import { Fonts } from '@/constants/theme';
import { formatDate } from '@/helpers/date-formatter';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';

import Avatar from '@/components/ui/avatar';
import { Ionicons } from '@expo/vector-icons';
import { useDeliveryDetails } from '../use-fetch';

interface DeliveryDetailsModalProps {
  visible: boolean;
  orderId: string | null;
  onClose: () => void;
}

export default function DeliveryDetailsModal({
  visible,
  orderId,
  onClose,
}: DeliveryDetailsModalProps) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const {
    data: deliveryData,
    isLoading,
    isError,
  } = useDeliveryDetails(orderId ?? '');

  const data = deliveryData?.data;

  const order = data?.order;
  const customer = data?.customer;
  const assignment = data?.assignment;
  const stores = data?.stores ?? [];

  /**
   * The recipient is the person actually receiving
   * the delivery. This is more useful to the driver
   * than the account customer's information.
   */
  const recipientName =
    order?.recipientName ||
    `${customer?.firstName ?? ''} ${customer?.lastName ?? ''}`.trim();

  const recipientPhone = order?.recipientPhone || customer?.phoneNumber || null;

  const handleCallRecipient = () => {
    if (!recipientPhone) {
      return;
    }

    Linking.openURL(`tel:${recipientPhone}`);
  };

  const handleOpenLocation = (latitude?: number, longitude?: number) => {
    if (latitude === undefined || longitude === undefined) {
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    Linking.openURL(url);
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      position="bottom"
      height="90%"
      maxHeight="90%"
      isPadding={false}
    >
      <View style={styles.container}>
        {/* -------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------- */}

        <View style={styles.header}>
          <View style={styles.dragHandle} />

          <View style={styles.headerRow}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.title}>Delivery Details</Text>

              {order?.orderNumber && (
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
              )}
            </View>

            <IconButton icon="close" size="md" variant="soft" onPress={onClose} accessibilityLabel="Close" />
          </View>
        </View>

        {/* -------------------------------- */}
        {/* CONTENT */}
        {/* -------------------------------- */}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />

            <Text style={styles.loadingText}>Loading delivery details...</Text>
          </View>
        ) : isError || !data || !order ? (
          <View style={styles.errorContainer}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorIconText}>!</Text>
            </View>

            <Text style={styles.errorTitle}>Unable to load delivery</Text>

            <Text style={styles.errorText}>
              We couldn't retrieve the delivery details. Please try again.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* -------------------------------- */}
            {/* STATUS */}
            {/* -------------------------------- */}

            <View style={styles.statusCard}>
              <View style={styles.statusIcon}>
                <Text style={styles.statusIconText}>✓</Text>
              </View>

              <View style={styles.statusContent}>
                <Text style={styles.statusLabel}>Delivery status</Text>

                <Text style={styles.statusValue}>{order.orderStatus}</Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {order.paymentStatus}
                </Text>
              </View>
            </View>

            {/* -------------------------------- */}
            {/* RECIPIENT */}
            {/* -------------------------------- */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Details</Text>

              <View style={styles.recipientCard}>
                {/* <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {recipientName
                      ? recipientName.charAt(0).toUpperCase()
                      : '?'}
                  </Text>
                </View> */}

                <Avatar
                  size={48}
                  name={
                    customer.firstName + ' ' + customer.lastName || 'Customer'
                  }
                />

                <View style={styles.recipientInfo}>
                  <Text style={styles.recipientName} numberOfLines={1}>
                    {customer.firstName + ' ' + customer.lastName || 'Customer'}
                  </Text>

                  {recipientPhone ? (
                    <Pressable
                      onPress={handleCallRecipient}
                      style={styles.phoneButton}
                    >
                      <Text style={styles.phoneIcon}>☎</Text>

                      <Text style={styles.phoneText}>{recipientPhone}</Text>
                    </Pressable>
                  ) : (
                    <Text style={styles.noPhoneText}>
                      No phone number available
                    </Text>
                  )}
                </View>

                {recipientPhone && (
                  <Pressable
                    onPress={handleCallRecipient}
                    style={styles.callButton}
                  >
                    <Text style={styles.callButtonText}>Call</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* -------------------------------- */}
            {/* DROP-OFF */}
            {/* -------------------------------- */}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Drop-off location</Text>

                <View style={styles.destinationBadge}>
                  <Text style={styles.destinationBadgeText}>DROP-OFF</Text>
                </View>
              </View>

              <Pressable
                onPress={() =>
                  handleOpenLocation(
                    order.dropoffLocation?.latitude,
                    order.dropoffLocation?.longitude,
                  )
                }
                style={styles.locationCard}
              >
                <View style={[styles.locationIcon, styles.dropoffIcon]}>
                  <Ionicons
                    name="location-sharp"
                    size={20}
                    color={Colors.success}
                  />
                </View>

                <View style={styles.locationContent}>
                  <Text style={styles.locationTitle}>
                    {recipientName || 'Customer'}
                  </Text>

                  <Text style={styles.locationAddress}>
                    {order.dropoffLocation?.address ||
                      'No drop-off address available'}
                  </Text>

                  {order.dropoffLocation?.city !== 'N/A' &&
                    order.dropoffLocation?.city && (
                      <Text style={styles.locationMeta}>
                        {order.dropoffLocation.city}
                        {order.dropoffLocation.state &&
                        order.dropoffLocation.state !== 'N/A'
                          ? `, ${order.dropoffLocation.state}`
                          : ''}
                      </Text>
                    )}
                </View>

                <View style={styles.chevron}>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.text}
                  />
                </View>
              </Pressable>
            </View>

            {/* -------------------------------- */}
            {/* STORE / PICKUP */}
            {/* -------------------------------- */}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Pickup location</Text>

                <View style={styles.pickupBadge}>
                  <Text style={styles.pickupBadgeText}>PICKUP</Text>
                </View>
              </View>

              {stores.length > 0 ? (
                stores.map(
                  (store: {
                    id: string;
                    storeName: string;
                    address: string;
                    phoneNumber?: string;
                  }) => (
                    <Pressable
                      key={store.id}
                      onPress={() =>
                        handleOpenLocation(
                          order.pickupLocation?.latitude,
                          order.pickupLocation?.longitude,
                        )
                      }
                      style={styles.locationCard}
                    >
                      <View style={[styles.locationIcon, styles.pickupIcon]}>
                        <Ionicons
                          name="location-sharp"
                          size={20}
                          color={Colors.primary}
                        />
                      </View>

                      <View style={styles.locationContent}>
                        <Text style={styles.locationTitle}>
                          {store.storeName}
                        </Text>

                        <Text style={styles.locationAddress}>
                          {store.address}
                        </Text>

                        {store.phoneNumber && (
                          <Text style={styles.locationMeta}>
                            {store.phoneNumber}
                          </Text>
                        )}
                      </View>

                      <View style={styles.chevron}>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={Colors.text}
                        />
                      </View>
                    </Pressable>
                  ),
                )
              ) : order.pickupLocation ? (
                <Pressable
                  onPress={() =>
                    handleOpenLocation(
                      order.pickupLocation?.latitude,
                      order.pickupLocation?.longitude,
                    )
                  }
                  style={styles.locationCard}
                >
                  <View style={[styles.locationIcon, styles.pickupIcon]}>
                    <Text style={styles.locationIconText}>●</Text>
                  </View>

                  <View style={styles.locationContent}>
                    <Text style={styles.locationTitle}>
                      {order.pickupLocation.storeName}
                    </Text>

                    <Text style={styles.locationAddress}>
                      {order.pickupLocation.address}
                    </Text>
                  </View>

                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              ) : (
                <Text style={styles.emptyText}>
                  No pickup location available
                </Text>
              )}
            </View>

            {/* -------------------------------- */}
            {/* DELIVERY INSTRUCTIONS */}
            {/* -------------------------------- */}

            {order.deliveryInstructions && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Delivery instructions</Text>

                <View style={styles.instructionCard}>
                  <Text style={styles.instructionIcon}>“</Text>

                  <Text style={styles.instructionText}>
                    {order.deliveryInstructions}
                  </Text>
                </View>
              </View>
            )}

            {/* -------------------------------- */}
            {/* DELIVERY SUMMARY */}
            {/* -------------------------------- */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery summary</Text>

              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery fee</Text>

                  <Text style={styles.summaryValue}>
                    ₦ {order.deliveryFee.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivered</Text>

                  <Text style={styles.summaryValueMuted}>
                    {formatDate(order.deliveredAt || assignment?.deliveredAt)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        )}
      </View>
    </AppModal>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    // ========================================
    // CONTAINER
    // ========================================

    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    // ========================================
    // HEADER
    // ========================================

    header: {
      paddingTop: scale(10),
      paddingBottom: scale(14),
      paddingHorizontal: scale(20),
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },

    dragHandle: {
      width: scale(40),
      height: scale(4),
      borderRadius: scale(10),
      backgroundColor: Colors.border,
      alignSelf: 'center',
      marginBottom: scale(12),
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    headerTitleContainer: {
      flex: 1,
      marginRight: scale(12),
    },

    title: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandBold,
      color: Colors.text,
    },

    orderNumber: {
      marginTop: scale(3),
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
    },

    // ========================================
    // CONTENT
    // ========================================

    content: {
      flex: 1,
    },

    contentContainer: {
      paddingHorizontal: scale(20),
      paddingTop: scale(18),
      paddingBottom: scale(30),
    },

    // ========================================
    // LOADING
    // ========================================

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scale(30),
    },

    loadingText: {
      marginTop: scale(12),
      fontSize: normalize(13),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
    },

    // ========================================
    // ERROR
    // ========================================

    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scale(40),
    },

    errorIcon: {
      width: scale(48),
      height: scale(48),
      borderRadius: scale(24),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.errorExtraLight,
      marginBottom: scale(14),
    },

    errorIconText: {
      fontSize: normalize(20),
      fontFamily: Fonts.brandBold,
      color: Colors.error,
    },

    errorTitle: {
      fontSize: normalize(15),
      fontFamily: Fonts.brandBold,
      color: Colors.text,
      textAlign: 'center',
      marginBottom: scale(6),
    },

    errorText: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
      textAlign: 'center',
      lineHeight: normalize(18),
    },

    // ========================================
    // SECTIONS
    // ========================================

    section: {
      marginBottom: scale(22),
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: scale(4),
    },

    sectionTitle: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
      marginBottom: scale(10),
    },

    // ========================================
    // STATUS
    // ========================================

    statusCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: scale(14),
      borderRadius: scale(16),
      backgroundColor: Colors.inputBackground,
      marginBottom: scale(22),
    },

    statusIcon: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.successExtraLight,
      marginRight: scale(12),
    },

    statusIconText: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandBold,
      color: Colors.success,
    },

    statusContent: {
      flex: 1,
    },

    statusLabel: {
      fontSize: normalize(10),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
      marginBottom: scale(2),
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    statusValue: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandBold,
      color: Colors.text,
    },

    statusBadge: {
      paddingHorizontal: scale(9),
      paddingVertical: scale(5),
      borderRadius: scale(8),
      backgroundColor: Colors.successExtraLight,
    },

    statusBadgeText: {
      fontSize: normalize(9),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.success,
    },

    // ========================================
    // RECIPIENT
    // ========================================

    recipientCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: scale(14),
      borderRadius: scale(16),
      gap: scale(8),
      backgroundColor: Colors.inputBackground,
    },

    avatar: {
      width: scale(44),
      height: scale(44),
      borderRadius: scale(22),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primary,
      marginRight: scale(12),
    },

    avatarText: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandBold,
      color: '#FFFFFF',
    },

    recipientInfo: {
      flex: 1,
    },

    recipientName: {
      fontSize: normalize(14),
      textTransform: 'capitalize',
      fontFamily: Fonts.brandBold,
      color: Colors.text,
      marginBottom: scale(5),
    },

    phoneButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    phoneIcon: {
      fontSize: normalize(12),
      color: Colors.primary,
      marginRight: scale(5),
    },

    phoneText: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
      color: Colors.primary,
    },

    noPhoneText: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
    },

    callButton: {
      paddingHorizontal: scale(12),
      paddingVertical: scale(8),
      borderRadius: scale(9),
      backgroundColor: Colors.primary,
      marginLeft: scale(8),
    },

    callButtonText: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandBold,
      color: Colors.text,
    },

    // ========================================
    // LOCATIONS
    // ========================================

    locationCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: scale(14),
      borderRadius: scale(16),
      backgroundColor: Colors.inputBackground,
    },

    locationIcon: {
      width: scale(38),
      height: scale(38),
      borderRadius: scale(19),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(12),
    },

    pickupIcon: {
      backgroundColor: Colors.primaryLight,
    },

    dropoffIcon: {
      backgroundColor: Colors.successExtraLight,
    },

    locationIconText: {
      fontSize: normalize(13),
      color: Colors.primary,
    },

    locationContent: {
      flex: 1,
    },

    locationTitle: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandBold,
      color: Colors.text,
      marginBottom: scale(4),
      textTransform: 'capitalize',
    },

    locationAddress: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
      lineHeight: normalize(17),
    },

    locationMeta: {
      marginTop: scale(4),
      fontSize: normalize(10),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
    },

    chevron: {
      fontSize: normalize(26),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
      marginLeft: scale(8),
    },

    destinationBadge: {
      paddingHorizontal: scale(7),
      paddingVertical: scale(4),
      borderRadius: scale(6),
      backgroundColor: Colors.successExtraLight,
    },

    destinationBadgeText: {
      fontSize: normalize(8),
      fontFamily: Fonts.brandBold,
      color: Colors.success,
      letterSpacing: 0.4,
    },

    pickupBadge: {
      paddingHorizontal: scale(7),
      paddingVertical: scale(4),
      borderRadius: scale(6),
      backgroundColor: Colors.primaryLight,
    },

    pickupBadgeText: {
      fontSize: normalize(8),
      fontFamily: Fonts.brandBold,
      color: Colors.primary,
      letterSpacing: 0.4,
    },

    emptyText: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
    },

    // ========================================
    // INSTRUCTIONS
    // ========================================

    instructionCard: {
      flexDirection: 'row',
      padding: scale(14),
      borderRadius: scale(16),
      backgroundColor: Colors.inputBackground,
      borderLeftWidth: scale(3),
      borderLeftColor: Colors.primary,
    },

    instructionIcon: {
      fontSize: normalize(26),
      fontFamily: Fonts.brandBold,
      color: Colors.primary,
      marginRight: scale(8),
      lineHeight: normalize(24),
    },

    instructionText: {
      flex: 1,
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
      lineHeight: normalize(18),
    },

    // ========================================
    // SUMMARY
    // ========================================

    summaryCard: {
      padding: scale(15),
      borderRadius: scale(16),
      backgroundColor: Colors.inputBackground,
    },

    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    summaryLabel: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
    },

    summaryValue: {
      fontSize: normalize(15),
      fontFamily: Fonts.brandBold,
      color: Colors.primary,
    },

    summaryValueMuted: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
      textAlign: 'right',
    },

    summaryDivider: {
      height: 1,
      backgroundColor: Colors.border,
      marginVertical: scale(12),
    },

    bottomSpacing: {
      height: scale(20),
    },
  });
