import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import AppModal from '@/components/layout/app-modal';
import { ThemedText } from '@/components/themed-text';
import IconButton from '@/components/ui/buttons/icon-button';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { formatDate } from '@/helpers/date-formatter';
import { useTheme } from '@/hooks/use-theme';

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.dragHandle} />

          <View style={styles.headerRow}>
            <View style={styles.flex}>
              <ThemedText style={styles.title}>Delivery details</ThemedText>

              {order?.orderNumber && (
                <ThemedText style={styles.subtitle} themeColor="textMuted">
                  {order.orderNumber}
                </ThemedText>
              )}
            </View>

            <IconButton
              icon="close"
              iconSize={18}
              variant="soft"
              onPress={onClose}
              accessibilityLabel="Close"
            />
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={Colors.primary} />

            <ThemedText style={styles.stateMessage} themeColor="textMuted">
              Loading delivery details...
            </ThemedText>
          </View>
        ) : isError || !data || !order ? (
          <View style={styles.centerState}>
            <View style={[styles.stateIcon, { backgroundColor: Colors.errorLight }]}>
              <Ionicons name="alert-circle-outline" size={20} color={Colors.error} />
            </View>

            <ThemedText style={styles.stateTitle}>Unable to load delivery</ThemedText>

            <ThemedText style={styles.stateMessage} themeColor="textMuted">
              We couldn&apos;t retrieve the delivery details. Please try again.
            </ThemedText>
          </View>
        ) : (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Status */}
            <View style={[styles.card, styles.row]}>
              <View style={[styles.roundIcon, { backgroundColor: Colors.successExtraLight }]}>
                <Ionicons name="checkmark" size={18} color={Colors.success} />
              </View>

              <View style={styles.flex}>
                <ThemedText style={styles.label} themeColor="textMuted">
                  Delivery status
                </ThemedText>
                <ThemedText style={styles.cardTitle}>{order.orderStatus}</ThemedText>
              </View>

              <View style={[styles.pill, { backgroundColor: Colors.successExtraLight }]}>
                <ThemedText style={styles.pillText} themeColor="success">
                  {order.paymentStatus}
                </ThemedText>
              </View>
            </View>

            {/* Recipient */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Customer details</ThemedText>

              <View style={[styles.card, styles.row]}>
                <Avatar
                  size={44}
                  name={customer.firstName + ' ' + customer.lastName || 'Customer'}
                />

                <View style={styles.flex}>
                  <ThemedText style={[styles.cardTitle, styles.capitalize]} numberOfLines={1}>
                    {customer.firstName + ' ' + customer.lastName || 'Customer'}
                  </ThemedText>

                  {recipientPhone ? (
                    <Pressable onPress={handleCallRecipient} style={styles.inline} hitSlop={6}>
                      <Ionicons name="call-outline" size={14} color={Colors.primary} />
                      <ThemedText style={styles.secondary} themeColor="primary">
                        {recipientPhone}
                      </ThemedText>
                    </Pressable>
                  ) : (
                    <ThemedText style={styles.meta} themeColor="textMuted">
                      No phone number available
                    </ThemedText>
                  )}
                </View>

                {recipientPhone && (
                  <Button size="xs" onPress={handleCallRecipient}>
                    Call
                  </Button>
                )}
              </View>
            </View>

            {/* Drop-off */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Drop-off location</ThemedText>

                <View style={[styles.pill, { backgroundColor: Colors.successExtraLight }]}>
                  <ThemedText style={styles.pillText} themeColor="success">
                    Drop-off
                  </ThemedText>
                </View>
              </View>

              <Pressable
                onPress={() =>
                  handleOpenLocation(
                    order.dropoffLocation?.latitude,
                    order.dropoffLocation?.longitude,
                  )
                }
                style={({ pressed }) => [styles.card, styles.row, pressed && styles.pressed]}
              >
                <View style={[styles.roundIcon, { backgroundColor: Colors.successExtraLight }]}>
                  <Ionicons name="location-outline" size={18} color={Colors.success} />
                </View>

                <View style={styles.locationContent}>
                  <ThemedText style={[styles.cardTitle, styles.capitalize]}>
                    {recipientName || 'Customer'}
                  </ThemedText>

                  <ThemedText style={styles.secondary} themeColor="textSecondary">
                    {order.dropoffLocation?.address || 'No drop-off address available'}
                  </ThemedText>

                  {order.dropoffLocation?.city !== 'N/A' && order.dropoffLocation?.city && (
                    <ThemedText style={styles.meta} themeColor="textMuted">
                      {order.dropoffLocation.city}
                      {order.dropoffLocation.state && order.dropoffLocation.state !== 'N/A'
                        ? `, ${order.dropoffLocation.state}`
                        : ''}
                    </ThemedText>
                  )}
                </View>

                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </Pressable>
            </View>

            {/* Store / pickup */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Pickup location</ThemedText>

                <View style={[styles.pill, { backgroundColor: Colors.primaryExtraLight }]}>
                  <ThemedText style={styles.pillText} themeColor="primary">
                    Pickup
                  </ThemedText>
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
                      style={({ pressed }) => [styles.card, styles.row, pressed && styles.pressed]}
                    >
                      <View style={[styles.roundIcon, { backgroundColor: Colors.primaryExtraLight }]}>
                        <Ionicons name="storefront-outline" size={18} color={Colors.primary} />
                      </View>

                      <View style={styles.locationContent}>
                        <ThemedText style={[styles.cardTitle, styles.capitalize]}>
                          {store.storeName}
                        </ThemedText>

                        <ThemedText style={styles.secondary} themeColor="textSecondary">
                          {store.address}
                        </ThemedText>

                        {store.phoneNumber && (
                          <ThemedText style={styles.meta} themeColor="textMuted">
                            {store.phoneNumber}
                          </ThemedText>
                        )}
                      </View>

                      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
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
                  style={({ pressed }) => [styles.card, styles.row, pressed && styles.pressed]}
                >
                  <View style={[styles.roundIcon, { backgroundColor: Colors.primaryExtraLight }]}>
                    <Ionicons name="storefront-outline" size={18} color={Colors.primary} />
                  </View>

                  <View style={styles.locationContent}>
                    <ThemedText style={[styles.cardTitle, styles.capitalize]}>
                      {order.pickupLocation.storeName}
                    </ThemedText>

                    <ThemedText style={styles.secondary} themeColor="textSecondary">
                      {order.pickupLocation.address}
                    </ThemedText>
                  </View>

                  <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                </Pressable>
              ) : (
                <ThemedText style={styles.secondary} themeColor="textMuted">
                  No pickup location available
                </ThemedText>
              )}
            </View>

            {/* Delivery instructions */}
            {order.deliveryInstructions && (
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Delivery instructions</ThemedText>

                <View style={[styles.card, styles.instructionCard]}>
                  <Ionicons name="chatbox-ellipses-outline" size={18} color={Colors.primary} />

                  <ThemedText style={[styles.body, styles.flex]}>
                    {order.deliveryInstructions}
                  </ThemedText>
                </View>
              </View>
            )}

            {/* Delivery summary */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Delivery summary</ThemedText>

              <View style={styles.card}>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.secondary} themeColor="textMuted">
                    Delivery fee
                  </ThemedText>

                  <ThemedText style={styles.cardTitle} themeColor="primary">
                    ₦ {order.deliveryFee.toLocaleString()}
                  </ThemedText>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <ThemedText style={styles.secondary} themeColor="textMuted">
                    Delivered
                  </ThemedText>

                  <ThemedText style={[styles.secondary, styles.alignRight]}>
                    {formatDate(order.deliveredAt || assignment?.deliveredAt)}
                  </ThemedText>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </AppModal>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    container: {
      flex: 1,
      backgroundColor: Colors.card,
    },

    header: {
      paddingTop: Spacing.three,
      paddingHorizontal: Spacing.four,
      paddingBottom: Spacing.three,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },

    dragHandle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.border,
      marginBottom: Spacing.four,
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.three,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
    },

    subtitle: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 18,
    },

    contentContainer: {
      gap: Spacing.four,
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.four,
      paddingBottom: Spacing.five,
    },

    centerState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.two,
      paddingHorizontal: Spacing.five,
    },

    stateIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.one,
    },

    stateTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
      textAlign: 'center',
    },

    stateMessage: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
    },

    section: {
      gap: 12,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.two,
    },

    sectionTitle: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },

    card: {
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    pressed: {
      backgroundColor: Colors.backgroundSecondary,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    inline: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
      marginTop: 2,
    },

    roundIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },

    label: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },

    cardTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    capitalize: {
      textTransform: 'capitalize',
    },

    body: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
    },

    secondary: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    meta: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    pill: {
      paddingHorizontal: Spacing.two,
      paddingVertical: 2,
      borderRadius: 999,
    },

    pillText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
    },

    locationContent: {
      flex: 1,
      gap: 2,
    },

    instructionCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },

    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.two,
    },

    summaryDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginVertical: 12,
    },

    alignRight: {
      textAlign: 'right',
    },
  });
