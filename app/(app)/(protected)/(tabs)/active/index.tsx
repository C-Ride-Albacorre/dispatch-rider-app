import {
  HEADER_HEIGHT,
  useScrollHeader,
} from '@/components/layout/scroll-header-context';
import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import ConfirmDeclineRequest from '@/features/active/confirm-decline-request';
import ConfirmDelivery from '@/features/active/confirm-delivery';
import ConfirmPickup from '@/features/active/confirm-pickup';
import NoActiveJob from '@/features/active/no-active-job';
import StatusDot from '@/features/active/status-dot';
import { useDashboardStats } from '@/features/home/use-fetch';
import { formatDate } from '@/helpers/date-formatter';
import { useDriverSocket } from '@/hooks/use-driver-socket';
import { useMapSocket } from '@/hooks/use-map-socket';
import { useTheme } from '@/hooks/use-theme';
import {
  ActiveOrderProps,
  useDriverJobsStore,
} from '@/store/driver-jobs-store';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import polyline from '@mapbox/polyline';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DriverStatus } from '../home';

// const STATUS_CONFIG = {
//   ORDER_ASSIGNED: {
//     title: 'Waiting for Pickup',
//     color: '#F59E0B',
//     task: 'Go to Benola Foods and collect the order.',
//   },

//   PICKED_UP: {
//     title: 'In Transit',
//     color: '#3B82F6',
//     task: 'Deliver the order to the customer.',
//   },

//   DELIVERED: {
//     title: 'Delivered',
//     color: '#10B981',
//     task: 'Order completed.',
//   },
// };

export default function ActiveDeliveryContent() {
  const { Colors, isDark } = useTheme();
  const styles = createStyles(Colors);

  const insets = useSafeAreaInsets();

  const scrollHandler = useScrollHeader();

  const [showConfirmDeclineModal, setShowConfirmDeclineModal] =
    useState<boolean>(false);

  const [showConfirmPickupModal, setShowConfirmPickupModal] =
    useState<boolean>(false);

  const [showConfirmDeliveryModal, setShowConfirmDeliveryModal] =
    useState<boolean>(false);

  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  // const currentStatus = order?.status;

  const { data } = useDashboardStats();

  const stats = data?.stats;

  const driverStatus: DriverStatus =
    (stats?.status as DriverStatus) ?? 'OFFLINE';

  useDriverSocket(driverStatus);

  const activeOrder: ActiveOrderProps | null = useDriverJobsStore(
    (s) => s.activeOrder,
  );

  console.log('📦 ACTIVE ORDER:', activeOrder);

  const orderId = useMemo(() => activeOrder?.order_id, [activeOrder?.order_id]);

  const shouldConnect = !!orderId;

  useMapSocket(shouldConnect ? orderId : undefined);

  const driverLocation = useDriverJobsStore((s) => s.tracking.driverLocation);

  const etaToVendor = useDriverJobsStore((s) => s.tracking.eta.toVendor);

  const etaToCustomer = useDriverJobsStore((s) => s.tracking.eta.toCustomer);

  const vendorPolyline: string | null = useDriverJobsStore(
    (s) => s.tracking.polylines.toVendor,
  );

  const customerPolyline: string | null = useDriverJobsStore(
    (s) => s.tracking.polylines.toCustomer,
  );

  const orderStatus = useDriverJobsStore((s) => s.tracking.orderStatus);

  console.log(
    '📦 ORDER STATUS:',
    orderStatus,
    'DRIVER LOCATION:',
    driverLocation,
    'ETA TO VENDOR:',
    etaToVendor,
    'ETA TO CUSTOMER:',
    etaToCustomer,
    'VENDOR POLYLINE:',
    vendorPolyline,
    'CUSTOMER POLYLINE:',
    customerPolyline,
  );

  const activePolyline = vendorPolyline ?? customerPolyline;

  const coordinates = useMemo(() => {
    if (!activePolyline) return [];

    try {
      const decoded = polyline.decode(activePolyline) as Array<
        [number, number]
      >;

      const routePoints = decoded.map(([lat, lng]) => ({
        latitude: Number(lat),
        longitude: Number(lng),
      }));

      return routePoints.filter(
        (point) =>
          Number.isFinite(point.latitude) && Number.isFinite(point.longitude),
      );
    } catch (error) {
      console.log('❌ Failed to decode polyline:', error);
      return [];
    }
  }, [activePolyline]);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!driverLocation) return;

    mapRef.current?.animateCamera({
      center: {
        latitude: driverLocation.lat,
        longitude: driverLocation.lng,
      },
      zoom: 16,
    });
  }, [driverLocation]);

  const deliveryPhase = useMemo(() => {
    if (vendorPolyline) return 'TO_VENDOR';
    if (customerPolyline) return 'TO_CUSTOMER';
    if (orderStatus === 'PICKED_UP') return 'PICKED_UP';
    if (orderStatus === 'DELIVERED') return 'DELIVERED';
    return 'IDLE';
  }, [vendorPolyline, customerPolyline, orderStatus]);

  const isPickupActive = deliveryPhase === 'TO_VENDOR';
  const isCustomerActive = deliveryPhase === 'TO_CUSTOMER';

  useEffect(() => {
    if (!isMapReady) return;
    if (!mapRef.current) return;
    if (coordinates.length < 2) return;

    requestAnimationFrame(() => {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 100,
          left: 50,
          right: 50,
          bottom: 200,
        },
        animated: true,
      });
    });
  }, [coordinates, isMapReady]);

  const etaText = useMemo(() => {
    const eta = etaToCustomer ?? etaToVendor;

    if (eta == null) return 'Waiting...';

    if (eta < 60) return `${eta} sec`;

    return `${Math.ceil(eta / 60)} min`;
  }, [etaToVendor, etaToCustomer]);

  const trackingMessage = useMemo(() => {
    if (vendorPolyline) return 'Driver is heading to vendor';

    if (customerPolyline) return 'Driver is heading to customer';

    if (orderStatus === 'PICKED_UP') return 'Order picked up';

    if (orderStatus === 'DELIVERED') return 'Delivered';

    return 'Waiting...';
  }, [vendorPolyline, customerPolyline, orderStatus]);

  // const eta = activeOrder?.etaSeconds ?? 0;

  const handleConfirmDecline = () => {
    if (!activeOrder?.order_id) {
      return;
    }

    setSelectedOrderId(activeOrder.order_id);

    setShowConfirmDeclineModal(true);
  };

  const handleConfirmPickup = () => {
    if (!activeOrder?.order_id) {
      return;
    }

    setSelectedOrderId(activeOrder.order_id);

    setShowConfirmPickupModal(true);
  };

  const driverCoord = driverLocation
    ? {
        latitude: driverLocation.lat,
        longitude: driverLocation.lng,
      }
    : null;

  const handleConfirmDelivery = () => {
    if (!activeOrder?.order_id) {
      return;
    }

    setSelectedOrderId(activeOrder.order_id);

    setShowConfirmDeliveryModal(true);
  };

  // console.log('📦 ACTIVE ORDER:', activeOrder);
  console.log(
    ' 📦 PICK UP LOCATION:',
    activeOrder?.pickup_location ?? 'Pick Up done',
  );

  console.log(' 📦Activeeeee:', activeOrder);

  // Example status, replace with actual data

  // const currentIndex = timelineSteps.findIndex(
  //   (step) => step.key === currentStatus,
  // );

  if (!activeOrder) {
    return (
      <>
        <NoActiveJob />
      </>
    );
  }

  return (
    <>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + insets.top }}
      >
        <View style={styles.container}>
          {/* 1. Map Canvas Section */}

          <View style={styles.mapContainer}>
            <MapView
              initialRegion={{
                latitude:
                  Number(activeOrder.pickup_location.latitude) ||
                  coordinates[0]?.latitude ||
                  6.5244,
                longitude:
                  Number(activeOrder.pickup_location.longitude) ||
                  coordinates[0]?.longitude ||
                  3.3792,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={StyleSheet.absoluteFill}
              onMapReady={() => setIsMapReady(true)}
              showsUserLocation={false}
              showsCompass
            >
              {/* Store */}

              <Marker
                coordinate={{
                  latitude: activeOrder.pickup_location.latitude,
                  longitude: activeOrder.pickup_location.longitude,
                }}
                pinColor="green"
              />

              {/* <Marker
                coordinate={{
                  latitude: activeOrder.dropoff_location.latitude,
                  longitude: activeOrder.dropoff_location.longitude,
                }}
                pinColor="red"
              /> */}

              {/* Driver */}

              {driverLocation && (
                <Marker
                  coordinate={{
                    latitude: driverLocation.lat,
                    longitude: driverLocation.lng,
                  }}
                >
                  <Ionicons name="car" size={32} color="#16a34a" />
                </Marker>
              )}

              <Polyline
                coordinates={
                  driverCoord ? [driverCoord, ...coordinates] : coordinates
                }
                strokeWidth={4}
                strokeColor="#16a34a"
              />
            </MapView>
          </View>

          <View style={styles.statusContainer}>
            <View style={styles.statusContent}>
              <Ionicons
                name="bicycle"
                size={scale(20)}
                color={Colors.success}
              />
              <Text style={styles.statusText}> {trackingMessage}</Text>
            </View>

            <View style={styles.statusContent}>
              <Ionicons
                name="time-outline"
                size={scale(16)}
                color={Colors.success}
              />
              <Text style={styles.etaText}>{etaText}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.addressesContainerHeader}>
              <StatusDot active={isPickupActive} />
              <Text style={styles.sectionLabel}>Vendor Location</Text>
            </View>

            <View style={styles.storeRow}>
              <Image
                source={{
                  uri: activeOrder.store_logo,
                }}
                style={styles.logo}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.storeName}>{activeOrder.store_name}</Text>

                <Text style={styles.address}>
                  {activeOrder?.pickup_location?.address ?? 'N/A'}
                </Text>

                <Text style={styles.coordinates}>
                  {activeOrder.store_lat.toFixed(5)},{' '}
                  {activeOrder.store_lng.toFixed(5)}
                </Text>
              </View>
            </View>

            {/* <Button
            variant="inverted"
            leftIcon={<Ionicons name="navigate" size={16} color="#FFF" />}
          >
            Navigate to Store
          </Button> */}
          </View>

          <View style={styles.card}>
            <View style={styles.addressesContainerHeader}>
              <StatusDot active={isCustomerActive} />
              <Text style={styles.sectionLabel}>Customer Location</Text>
            </View>

            <View style={styles.addressesContainerRow}>
              <View
                style={[
                  styles.addressWrapper,
                  { backgroundColor: Colors.successExtraLight },
                ]}
              >
                <Ionicons
                  name="location"
                  size={scale(20)}
                  color={Colors.success}
                />
              </View>

              <View>
                <Text style={styles.address}>
                  {activeOrder.dropoff_location.address}
                </Text>

                <Text style={styles.city}>
                  {activeOrder.dropoff_location.city},{' '}
                  {activeOrder.dropoff_location.state}
                </Text>

                <Text style={styles.city}>
                  {activeOrder.dropoff_location.country}
                </Text>

                <Text style={styles.city}>
                  {activeOrder.dropoff_location.postalCode}
                </Text>
              </View>
            </View>

            {/* <Button variant="outline">View Route</Button> */}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Order Items</Text>

            {activeOrder.items.map((item) => (
              <View key={item.productName} style={styles.itemRow}>
                <View style={styles.itemNameContainer}>
                  <Text style={styles.itemName}>{item.productName}</Text>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                </View>

                <Text style={styles.itemPrice}>
                  ₦{item.unitPrice.toLocaleString()}
                </Text>
              </View>
            ))}

            <View style={styles.itemTotalPriceRow}>
              <Text style={styles.totalLabel}>Total</Text>

              <Text style={styles.totalPrice}>
                ₦{activeOrder.total_amount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* 2. Linear Step Indicator Progress Bar */}
          {/* <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Ionicons name="bicycle" size={24} color={Colors.success} />
            <Text style={styles.progressTitle}>Delivery Progress</Text>
          </View>
          <View style={{ paddingHorizontal: scale(16) }}>
            {timelineSteps.map((step, index) => {
              const completed = index < currentIndex;
              const active = index === currentIndex;
              const pending = index > currentIndex;

              return (
                <View key={step.key} style={styles.timelineItem}>
                  <View style={styles.timelineIndicator}>
                
                    {completed ? (
                      <View
                        style={[
                          styles.timelineCircle,
                          { backgroundColor: Colors.success },
                        ]}
                      >
                        <Ionicons name="checkmark" size={12} color="#FFF" />
                      </View>
                    ) : active ? (
                      <View
                        style={[
                          styles.timelineCircle,
                          {
                            borderWidth: 2,
                            borderColor: Colors.primary,
                            backgroundColor: '#FFF',
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.activeDot,
                            { backgroundColor: Colors.primary },
                          ]}
                        />
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.timelineCircle,
                          { backgroundColor: Colors.border },
                        ]}
                      />
                    )}

                
                    {index !== timelineSteps.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          {
                            backgroundColor:
                              index < currentIndex
                                ? Colors.success
                                : Colors.border,
                          },
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineTitle,
                        completed
                          ? { color: Colors.success }
                          : active
                            ? { color: Colors.primary }
                            : { color: Colors.textMuted },
                      ]}
                    >
                      {step.title}
                    </Text>

                    <Text style={styles.timelineSubtitle}>
                      {step.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View> */}

          <View style={styles.card}>
            {/* <Text style={styles.orderNumber}>#{activeOrder.order_number}</Text> */}

            {/* <View style={styles.divider} /> */}

            <View style={styles.heroBottom}>
              <View style={styles.heroBottomPrice}>
                <Text style={styles.totalAmount}>
                  ₦{activeOrder.total_amount.toLocaleString()}
                </Text>

                <View style={styles.itemCount}>
                  <Text style={styles.itemCountText}>
                    Qty: {activeOrder.items.length} Items
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.metaGrid}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Created</Text>

                <Text style={styles.metaValue}>
                  {formatDate(activeOrder.created_at)}
                </Text>
              </View>

              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Assigned</Text>

                <Text style={styles.metaValue}>
                  {formatDate(activeOrder.assigned_at)}
                </Text>
              </View>

              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Distance</Text>

                <Text style={styles.metaValue}>
                  {(activeOrder.distance_meters / 1000).toFixed(1)} km
                </Text>
              </View>

              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Order ID</Text>

                <Text style={styles.metaValue}>{activeOrder.order_id}</Text>
              </View>
            </View>
          </View>

          {/* <View style={styles.detailsCard}>
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
        </View> */}

          <View style={styles.footer}>
            {activePolyline === vendorPolyline ? (
              <View style={styles.footerRow}>
                <Button
                  onPress={handleConfirmDecline}
                  variant="redOutline"
                  style={{ flex: 1 }}
                >
                  Decline Order
                </Button>

                <Button
                  onPress={handleConfirmPickup}
                  variant="green"
                  style={{ flex: 1 }}
                >
                  Confirm Pickup
                </Button>
              </View>
            ) : (
              <Button
                onPress={handleConfirmDelivery}
                variant="green"
                style={{ flex: 1 }}
              >
                Confirm Delivery
              </Button>
            )}
          </View>
        </View>
      </Animated.ScrollView>

      <ConfirmDeclineRequest
        showConfirmDeclineModal={showConfirmDeclineModal}
        setShowConfirmDeclineModal={setShowConfirmDeclineModal}
        selectedOrderId={selectedOrderId}
      />
      <ConfirmPickup
        showConfirmPickupModal={showConfirmPickupModal}
        setShowConfirmPickupModal={setShowConfirmPickupModal}
        selectedOrderId={selectedOrderId}
      />

      <ConfirmDelivery
        showConfirmDeliveryModal={showConfirmDeliveryModal}
        setShowConfirmDeliveryModal={setShowConfirmDeliveryModal}
        selectedOrderId={selectedOrderId}
      />
    </>
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

    title: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandRegular,
      textAlign: 'center',
      color: Colors.textMuted,
    },
    heroCard: {
      borderRadius: scale(24),

      borderWidth: 1,
      borderColor: Colors.border,
      gap: scale(12),
    },

    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: scale(8),
      padding: scale(12),
      borderWidth: 1,
      borderColor: Colors.success,
      borderRadius: scale(20),
      backgroundColor: Colors.successExtraLight,
    },

    statusContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(2),
    },

    statusText: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
    },

    orderNumber: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandMedium,
      color: Colors.textSecondary,
      paddingHorizontal: scale(20),
      paddingTop: scale(16),
    },

    heroBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    heroBottomPrice: {
      width: '100%',
      flexDirection: 'row',
      gap: scale(8),
      alignItems: 'center',
    },

    totalAmount: {
      fontSize: normalize(28),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.primary,
    },

    itemCount: {
      paddingVertical: scale(2),
      paddingHorizontal: scale(6),
      borderRadius: scale(24),
      backgroundColor: Colors.successExtraLight,
    },
    itemCountText: {
      fontSize: normalize(10),

      fontFamily: Fonts.brandMedium,
      color: Colors.success,
    },

    card: {
      backgroundColor: Colors.card,
      borderRadius: scale(20),
      padding: scale(16),
      borderWidth: 1,
      borderColor: Colors.border,
      gap: scale(12),
    },

    sectionLabel: {
      fontSize: normalize(12),
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: Colors.textMuted,
      fontFamily: Fonts.brandMedium,
    },

    addressesContainerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(6),
    },

    dot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
    },
    storeRow: {
      flexDirection: 'row',
      gap: scale(12),
      marginBottom: scale(16),
    },

    logo: {
      width: scale(56),
      height: scale(56),
      borderRadius: scale(16),
    },

    storeName: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandSemiBold,
      textTransform: 'capitalize',
    },

    address: {
      marginTop: scale(4),
      fontSize: normalize(13),
      color: Colors.text,
      lineHeight: scale(20),
      fontFamily: Fonts.brandMedium,
      textTransform: 'capitalize',
    },

    city: {
      marginTop: scale(4),
      fontSize: normalize(13),
      color: Colors.textMuted,
      fontFamily: Fonts.brandMedium,
    },

    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: scale(8),
    },

    itemNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(16),
    },

    itemName: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
      color: Colors.textSecondary,
      textTransform: 'capitalize',
    },

    itemQty: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
      color: Colors.success,
    },

    itemPrice: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },

    divider: {
      height: 1,
      backgroundColor: Colors.border,
      marginVertical: scale(12),
    },
    itemTotalPriceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',

      borderTopWidth: 1,
      borderTopColor: Colors.border,
      paddingTop: scale(16),
    },

    totalLabel: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandSemiBold,
    },

    totalPrice: {
      fontSize: normalize(18),
      color: Colors.primary,
      fontFamily: Fonts.brandSemiBold,
    },

    taskCard: {
      backgroundColor: Colors.primary + '10',
      borderRadius: scale(20),
      padding: scale(16),
      borderWidth: 1,
      borderColor: Colors.primary + '25',
      marginBottom: scale(100),
    },

    taskLabel: {
      fontSize: normalize(12),
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: Colors.primary,
      fontFamily: Fonts.brandSemiBold,
    },

    taskText: {
      marginTop: scale(8),
      fontSize: normalize(15),
      lineHeight: scale(24),
      fontFamily: Fonts.brandSemiBold,
    },

    footer: {
      gap: scale(12),
      paddingHorizontal: scale(16),
      paddingTop: scale(12),
      paddingBottom: scale(12),
      backgroundColor: Colors.background,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
    },

    footerRow: {
      flexDirection: 'row',
      gap: scale(12),
    },

    completedCard: {
      flex: 1,
      height: scale(56),
      borderRadius: scale(16),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.successExtraLight,
    },

    completedText: {
      fontSize: normalize(14),
      color: Colors.success,
      fontFamily: Fonts.brandSemiBold,
    },

    metaGrid: {
      gap: scale(14),
    },

    metaItem: {
      flex: 1,
    },

    metaLabel: {
      fontSize: normalize(11),
      color: Colors.textMuted,
      fontFamily: Fonts.brandRegular,
    },

    metaValue: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
    },

    statusBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
      paddingHorizontal: scale(8),
      paddingVertical: scale(4),
      borderRadius: scale(999),
    },

    coordinates: {
      marginTop: scale(4),
      fontSize: normalize(11),
      color: Colors.textMuted,
    },

    infoRow: {
      paddingVertical: scale(8),
    },

    infoLabel: {
      color: Colors.textMuted,
      fontFamily: Fonts.brandMedium,
    },

    infoValue: {
      flex: 1,

      fontFamily: Fonts.brandSemiBold,
    },

    iconWrapper: {
      width: scale(72),
      height: scale(72),
      borderRadius: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: scale(16),
    },

    addressWrapper: {
      width: scale(56),
      height: scale(56),
      borderRadius: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
    },

    mapContainer: {
      height: scale(220),
      borderRadius: scale(20),
      width: '100%',
      position: 'relative',
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
      backgroundColor: Colors.text,
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
      color: Colors.text,
    },

    progressCard: {
      borderRadius: scale(16),

      borderWidth: 1,
      borderColor: Colors.border,
    },

    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scale(16),
      gap: scale(8),
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
      padding: scale(16),
    },

    progressTitle: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
    },

    timelineItem: {
      flexDirection: 'row',
    },

    timelineIndicator: {
      alignItems: 'center',
      marginRight: scale(12),
    },

    timelineCircle: {
      width: scale(24),
      height: scale(24),
      borderRadius: scale(12),
      justifyContent: 'center',
      alignItems: 'center',
    },

    activeDot: {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(5),
    },

    timelineLine: {
      width: scale(2),
      minHeight: scale(40),
      marginTop: scale(4),
      flex: 1,
    },

    timelineContent: {
      flex: 1,
      paddingBottom: scale(20),
    },

    timelineTitle: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
    },

    timelineSubtitle: {
      marginTop: scale(2),
      fontSize: normalize(12),
      color: Colors.textSecondary,
      fontFamily: Fonts.brandRegular,
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

    status: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.textSecondary,
    },
    bottomCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: scale(16),
      padding: scale(16),
      borderWidth: 1,
      borderColor: '#EDF2F7',
    },

    bigTitle: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
      marginBottom: scale(8),
    },
  });
