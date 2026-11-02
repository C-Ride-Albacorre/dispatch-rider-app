import ScreenHeader from '@/components/layout/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import IconButton from '@/components/ui/buttons/icon-button';
import { Fonts, Spacing } from '@/constants/theme';
import AcceptButton from '@/features/jobs/components/accept-button';
import ConfirmRequest from '@/features/jobs/components/confirm-job-request';
import { useAvailableJobDetails } from '@/features/jobs/use-fetch';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderDetailSheet() {
  const [showConfirmRequestModal, setShowConfirmRequestModal] =
    useState<boolean>(false);

  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  // const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams();

  const { data: response, isLoading } = useAvailableJobDetails({
    orderId: id as string,
  });
  const order = response?.data ?? null;

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const handleAccept = () => {
    setShowConfirmRequestModal(true);
    setSelectedOrderId(order.id);
    // setSelectedOrder(order);
  };

  return (
    <>
      <ConfirmRequest
        showConfirmRequestModal={showConfirmRequestModal}
        setShowConfirmRequestModal={setShowConfirmRequestModal}
        selectedOrderId={selectedOrderId}
        // selectedOrder={selectedOrder}
      />

      <ThemedView style={styles.flex}>
        <StatusBar style="auto" />
        <ScreenHeader
          title="Order Breakdown"
          subtitle={order?.orderNumber || undefined}
          right={
            <IconButton
              icon="chevron-down"
              size="md"
              onPress={() => router.dismiss()}
              accessibilityLabel="Close"
            />
          }
        />

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : order ? (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              {/* 1. Secure Verification Code Display */}
              {/* <View
                style={[
                  styles.alertBanner,
                  { backgroundColor: Colors.successExtraLight },
                ]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={Colors.success}
                />
                <ThemedText style={styles.alertText} themeColor="success">
                  Requires Delivery PIN Verification:{' '}
                  <ThemedText style={{ fontFamily: Fonts.brandSemiBold }}>
                    {order.orderCode}
                  </ThemedText>
                </ThemedText>
              </View> */}

              {/* 2. Dispatch Nodes Segment */}
              <View style={styles.section}>
                <ThemedText style={styles.sectionLabel} themeColor="textMuted">
                  Dispatch Route
                </ThemedText>

                <View style={styles.groupCard}>
                  {order.stores?.map((store: any) => (
                    <View key={store.id} style={styles.nodeRow}>
                      {store.storeLogo ? (
                        <Image
                          source={{ uri: store.storeLogo }}
                          style={styles.storeLogo}
                        />
                      ) : (
                        <View
                          style={[
                            styles.iconWrapper,
                            { backgroundColor: Colors.successExtraLight },
                          ]}
                        >
                          <Ionicons
                            name="storefront-outline"
                            size={18}
                            color={Colors.success}
                          />
                        </View>
                      )}
                      <View style={styles.flex}>
                        <ThemedText style={styles.nodeTitle}>
                          {store.storeName}
                        </ThemedText>
                        <ThemedText
                          style={styles.nodeDesc}
                          themeColor="textMuted"
                          numberOfLines={2}
                        >
                          {store.storeAddress}
                        </ThemedText>
                      </View>
                    </View>
                  ))}

                  <View style={[styles.nodeRow, styles.nodeRowLast]}>
                    <View
                      style={[
                        styles.iconWrapper,
                        { backgroundColor: Colors.errorLight },
                      ]}
                    >
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color={Colors.error}
                      />
                    </View>
                    <View style={styles.flex}>
                      <ThemedText style={styles.nodeTitle}>
                        Deliver to: {order?.recipientName}
                      </ThemedText>
                      <ThemedText
                        style={styles.nodeDesc}
                        themeColor="textMuted"
                        numberOfLines={2}
                      >
                        {order.dropoffLocation?.address},{' '}
                        {order.dropoffLocation?.city}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>

              {/* 3. Driver Hand-Off Instructions */}
              {order.deliveryInstructions && (
                <View style={styles.section}>
                  <ThemedText
                    style={styles.sectionLabel}
                    themeColor="textMuted"
                  >
                    Delivery Instructions
                  </ThemedText>
                  <View style={[styles.card, styles.instructionBox]}>
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={18}
                      color={Colors.textMuted}
                      style={styles.instructionIcon}
                    />
                    <ThemedText style={styles.instructionText}>
                      "{order.deliveryInstructions}"
                    </ThemedText>
                  </View>
                </View>
              )}

              {/* 4. Ordered Items Map Array */}
              {/* <View style={styles.section}>
                <ThemedText style={styles.sectionLabel} themeColor="textMuted">
                  Items Package ({order.items?.length || 0})
                </ThemedText>
                <View style={styles.groupCard}>
                  {order.items?.map((item: any) => (
                    <View key={item.id} style={styles.itemRow}>
                      {item.productImage?.imageUrl ? (
                        <Image
                          source={{ uri: item.productImage.imageUrl }}
                          style={styles.itemImage}
                        />
                      ) : (
                        <View style={styles.itemImage} />
                      )}
                      <View style={styles.flex}>
                        <ThemedText style={styles.itemName} numberOfLines={1}>
                          {item.productName}
                        </ThemedText>
                        <ThemedText style={styles.itemMeta} themeColor="textMuted">
                          Qty: {item.quantity} · ₦
                          {item.unitPrice.toLocaleString()}
                          /unit
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.itemTotal}>
                        ₦{item.totalPrice.toLocaleString()}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View> */}

              {/* 5. Financial Audit Settlement Breakdown */}
              {/* <View style={styles.card}>
                <View style={styles.billRow}>
                  <ThemedText style={styles.billLabel} themeColor="textMuted">Subtotal</ThemedText>
                  <ThemedText style={styles.billValue}>
                    ₦{order.subtotal?.toLocaleString()}
                  </ThemedText>
                </View>
                <View style={styles.billRow}>
                  <ThemedText style={styles.billLabel} themeColor="textMuted">Delivery Fare Pay</ThemedText>
                  <ThemedText style={styles.billValue} themeColor="success">
                    +₦{order.deliveryFee?.toLocaleString()}
                  </ThemedText>
                </View>
                <View style={styles.divider} />
                <View style={styles.billRow}>
                  <ThemedText style={styles.totalLabel}>Total Payout</ThemedText>
                  <ThemedText style={styles.totalValue} themeColor="primary">
                    ₦{order.totalAmount?.toLocaleString()}
                  </ThemedText>
                </View>
              </View> */}
            </ScrollView>

            {/* Action Primary Sticky Footer Trigger */}
            <View
              style={[
                styles.actionWrapper,
                { paddingBottom: insets.bottom + Spacing.two },
              ]}
            >
              <AcceptButton
                label="Accept Delivery Request"
                amount={order.deliveryFee}
                onPress={handleAccept}
              />
            </View>
          </>
        ) : (
          <View style={styles.loaderContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={32}
              color={Colors.textMuted}
            />
            <ThemedText style={styles.emptyText} themeColor="textMuted">
              Failed to load parameters.
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.two,
    },

    emptyText: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
    },

    content: {
      gap: Spacing.four,
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.two,
      paddingBottom: Spacing.five,
    },

    section: {
      gap: 10,
    },

    sectionLabel: {
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

    // Grouped list card; rows carry their own padding and hairlines
    groupCard: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    alertBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
      padding: 12,
      borderRadius: 12,
    },

    alertText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 17,
    },

    storeLogo: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: Colors.backgroundTertiary,
    },

    iconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },

    nodeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },

    nodeRowLast: {
      borderBottomWidth: 0,
    },

    nodeTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
      textTransform: 'capitalize',
    },

    nodeDesc: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
      marginTop: Spacing.half,
    },

    instructionBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },

    instructionIcon: {
      marginTop: Spacing.half,
    },

    instructionText: {
      flex: 1,
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
      fontStyle: 'italic',
    },

    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },

    itemImage: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: Colors.backgroundTertiary,
    },

    itemName: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
      textTransform: 'capitalize',
    },

    itemMeta: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    itemTotal: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
    },

    billRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: Spacing.one,
    },

    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginVertical: Spacing.two,
    },

    billLabel: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    billValue: {
      fontFamily: Fonts.brandMedium,
      fontSize: 13,
      lineHeight: 18,
    },

    totalLabel: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    totalValue: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
    },

    actionWrapper: {
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.three,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
      backgroundColor: Colors.background,
    },
  });
