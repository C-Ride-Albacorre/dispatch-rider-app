import { ScrollHeaderContext } from '@/components/layout/scroll-header-context';
import Button from '@/components/ui/buttons/button';
import IconButton from '@/components/ui/buttons/icon-button';
import { Fonts } from '@/constants/theme';
import { useAvailableJobDetails } from '@/features/jobs/use-fetch';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderDetailSheet({
  onAccept,
}: {
  onAccept: (orderId: string, amount: number) => void;
}) {
  // const headerTranslateY = useSharedValue(0);

  const ctx = useContext(ScrollHeaderContext);

  if (!ctx) {
    throw new Error('Missing ScrollHeaderContext');
  }

  const { setShowHeader } = ctx;

  console.log('CTX', ctx);

  useFocusEffect(
    useCallback(() => {
      setShowHeader(false);

      return () => {
        setShowHeader(true);
      };
    }, []),
  );

  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams();

  const { data: response, isLoading } = useAvailableJobDetails({
    orderId: id as string,
  });
  const order = response?.data ?? [];

  console.log(' Order details for orderId:', id);

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Fixed Header Row Elements */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={[styles.headerTitle, { color: Colors.text }]}>
            Order Breakdown
          </Text>
          {order?.orderNumber && (
            <Text style={styles.headerSubtitle}>
              #{order.orderNumber.split('-')[1]}
            </Text>
          )}
        </View>

        <IconButton
          size="sm"
          variant="outlineSecondary"
          onPress={() => router.dismiss()}
        >
          <Ionicons name="close" size={16} color={Colors.textSecondary} />
        </IconButton>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : order ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: scale(16) }}
          >
            {/* 1. Secure Verification Code Display */}
            <View
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
              <Text style={[styles.alertText, { color: Colors.success }]}>
                Requires Delivery PIN Verification:{' '}
                <Text style={{ fontFamily: Fonts.brandSemiBold }}>
                  {order.orderCode}
                </Text>
              </Text>
            </View>

            {/* 2. Dispatch Nodes Segment */}
            <View style={styles.sectionSection}>
              <Text style={styles.sectionLabel}>DISPATCH ROUTE</Text>

              {order.stores?.map((store: any) => (
                <View key={store.id} style={styles.nodeRow}>
                  <View
                    style={[
                      styles.iconWrapper,
                      {
                        backgroundColor: Colors.successExtraLight,
                        marginTop: scale(2),
                      },
                    ]}
                  >
                    <Ionicons
                      name="storefront-outline"
                      size={16}
                      color={Colors.success}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.nodeTitle, { color: Colors.text }]}>
                      {store.storeName}
                    </Text>
                    <Text style={styles.nodeDesc} numberOfLines={2}>
                      {store.storeAddress}
                    </Text>
                  </View>
                </View>
              ))}

              <View style={[styles.nodeRow, { marginTop: scale(12) }]}>
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      backgroundColor: Colors.errorLight,
                      marginTop: scale(2),
                    },
                  ]}
                >
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={Colors.error}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.nodeTitle, { color: Colors.text }]}>
                    Deliver to: {order?.recipientName}
                  </Text>
                  <Text style={styles.nodeDesc} numberOfLines={2}>
                    {order.dropoffLocation?.address},{' '}
                    {order.dropoffLocation?.city}
                  </Text>
                </View>
              </View>
            </View>

            {/* 3. Driver Hand-Off Instructions */}
            {order.deliveryInstructions && (
              <View style={[styles.sectionSection, styles.instructionBox]}>
                <Text style={styles.sectionLabel}>DELIVERY INSTRUCTIONS</Text>
                <Text style={styles.instructionText}>
                  "{order.deliveryInstructions}"
                </Text>
              </View>
            )}

            {/* 4. Ordered Items Map Array */}
            <View style={styles.sectionSection}>
              <Text style={styles.sectionLabel}>
                ITEMS PACKAGE ({order.items?.length || 0})
              </Text>
              {order.items?.map((item: any) => (
                <View key={item.id} style={styles.itemRow}>
                  {item.productImage?.imageUrl ? (
                    <Image
                      source={{ uri: item.productImage.imageUrl }}
                      style={styles.itemImage}
                    />
                  ) : (
                    <View
                      style={[
                        styles.itemImage,
                        { backgroundColor: Colors.border },
                      ]}
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.itemName, { color: Colors.text }]}
                      numberOfLines={1}
                    >
                      {item.productName}
                    </Text>
                    <Text style={styles.itemMeta}>
                      Qty: {item.quantity} · ₦{item.unitPrice.toLocaleString()}
                      /unit
                    </Text>
                  </View>
                  <Text style={[styles.itemTotal, { color: Colors.text }]}>
                    ₦{item.totalPrice.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>

            {/* 5. Financial Audit Settlement Breakdown */}
            <View style={styles.billContainer}>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Subtotal</Text>
                <Text style={[styles.billValue, { color: Colors.text }]}>
                  ₦{order.subtotal?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Fare Pay</Text>
                <Text style={[styles.billValue, { color: Colors.success }]}>
                  +₦{order.deliveryFee?.toLocaleString()}
                </Text>
              </View>
              <View style={styles.billRowSpacer} />
              <View style={styles.billRow}>
                <Text style={styles.totalLabel}>Total Payout</Text>
                <Text style={[styles.totalValue, { color: Colors.primary }]}>
                  ₦{order.totalAmount?.toLocaleString()}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Primary Sticky Footer Trigger */}
          <View
            style={[
              styles.actionWrapper,
              {
                backgroundColor: Colors.background,
                paddingBottom: insets.bottom,
              },
            ]}
          >
            <Button onPress={() => onAccept(order.id, order.totalAmount)}>
              Accept Request · ₦{order.totalAmount?.toLocaleString()}
            </Button>
          </View>
        </>
      ) : (
        <View style={styles.loaderContainer}>
          <Text style={{ color: Colors.textMuted }}>
            Failed to load parameters.
          </Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      // flex: 1,
      backgroundColor: Colors.background,
      paddingVertical: scale(16),
    },

    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: scale(20),
      paddingVertical: scale(16),
    },
    headerTitle: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
    },
    headerSubtitle: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandRegular,
      color: Colors.textMuted,
      marginTop: scale(2),
    },
    closeBtn: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(16),
      justifyContent: 'center',
      alignItems: 'center',
    },
    loaderContainer: {
   flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollArea: {
      flex: 1,
    },
    alertBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
      padding: scale(12),
      borderRadius: scale(10),
      marginBottom: scale(16),
    },
    alertText: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
    },
    sectionSection: {
      marginBottom: scale(20),
    },
    sectionLabel: {
      fontSize: normalize(11),
      fontFamily: Fonts.brandMedium,
      color: Colors.textMuted,
      letterSpacing: normalize(0.8),
      marginBottom: scale(10),
    },

    iconWrapper: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(8),
      justifyContent: 'center',
      alignItems: 'center',
    },

    nodeRow: {
      flexDirection: 'row',
      gap: scale(10),
      alignItems: 'flex-start',
    },
    nodeTitle: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
      textTransform: 'capitalize',
    },
    nodeDesc: {
      fontSize: normalize(12),
      color: Colors.textMuted,
      marginTop: scale(2),
    },
    instructionBox: {
      backgroundColor: Colors.inputBackground,
      padding: scale(12),
      borderRadius: scale(10),
      borderLeftWidth: scale(3),
      borderLeftColor: Colors.border,
    },
    instructionText: {
      fontSize: normalize(13),
      color: Colors.text,
      fontFamily: Fonts.brandRegular,
      fontStyle: 'italic',
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
      paddingVertical: scale(8),
      borderBottomWidth: scale(1),
      borderBottomColor: Colors.border,
    },
    itemImage: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(8),
    },
    itemName: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
      textTransform: 'capitalize',
    },
    itemMeta: {
      fontSize: normalize(11),
      color: Colors.textMuted,
      marginTop: scale(1),
      fontFamily: Fonts.brandRegular,
    },
    itemTotal: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
    },
    billContainer: {
      backgroundColor: Colors.inputBackground,
      borderRadius: scale(12),
      padding: scale(14),
      marginBottom: scale(24),
    },
    billRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: scale(4),
    },
    billRowSpacer: {
      height: scale(1),
      backgroundColor: Colors.border,
      marginVertical: scale(8),
    },
    billLabel: {
      fontSize: normalize(13),
      color: Colors.textMuted,
      fontFamily: Fonts.brandRegular,
    },
    billValue: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandMedium,
    },
    totalLabel: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
    },
    totalValue: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandMedium,
    },
    actionWrapper: {
      paddingHorizontal: scale(20),
      paddingTop: scale(12),
    },
    submitBtn: {
      height: scale(48),
      borderRadius: scale(12),
      justifyContent: 'center',
      alignItems: 'center',
    },
    submitBtnText: {
      color: '#FFFFFF',
      fontSize: normalize(15),
      fontFamily: Fonts.brandSemiBold,
    },
  });
