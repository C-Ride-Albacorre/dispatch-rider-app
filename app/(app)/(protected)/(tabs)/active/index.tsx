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
import { useOrderTracking } from '@/features/active/use-fetch';
import { formatDate } from '@/helpers/date-formatter';
import { useTheme } from '@/hooks/use-theme';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { normalize, scale } from '@/utils/scaling';
import { trimPolyline } from '@/utils/trim-polyline';
import { Ionicons } from '@expo/vector-icons';
import polyline from '@mapbox/polyline';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  AnimatedRegion,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LOCATION_ANIMATION_DURATION = 450;

const CAMERA_ANIMATION_DURATION = 350;

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

  const [storeLogoLoaded, setStoreLogoLoaded] = useState(false);

  const [carRotation, setCarRotation] = useState(0);

  const [isFollowingDriver, setIsFollowingDriver] = useState(true);

  const [isWaitingForOrder, setIsWaitingForOrder] = useState(true);

  const activeOrder = useDriverJobsStore((s) => s.activeOrder);
  const setActiveOrder = useDriverJobsStore((s) => s.setActiveOrder);

  // Fetch active order from API
  const {
    data: fetchedOrder,
    isLoading: isOrderLoading,
    refetch,
    isFetching,
  } = useOrderTracking();
  const driverLocation = useDriverJobsStore((s) => s.driverLocation);
  const etaToVendor = useDriverJobsStore((s) => s.etaToVendor);
  const etaToCustomer = useDriverJobsStore((s) => s.etaToCustomer);
  const polylineToVendor = useDriverJobsStore((s) => s.polylineToVendor);
  const polylineToCustomer = useDriverJobsStore((s) => s.polylineToCustomer);

  console.log('DRIVER LOCATION FOR MARKER:', driverLocation);

  // Sync fetched order to store and handle loading state
  useEffect(() => {
    if (fetchedOrder?.order_id) {
      setActiveOrder(fetchedOrder);
      setIsWaitingForOrder(false);
      return;
    }

    if (!isOrderLoading) {
      // If loading finished but no order, show no active job
      setIsWaitingForOrder(false);
    }
  }, [fetchedOrder, isOrderLoading, setActiveOrder]);

  // Preload store logo image
  useEffect(() => {
    if (activeOrder?.store_logo) {
      Image.prefetch(activeOrder.store_logo)
        .then(() => setStoreLogoLoaded(true))
        .catch(() => {
          // Fallback to bag icon if image fails
          setStoreLogoLoaded(false);
        });
    }
  }, [activeOrder?.store_logo]);

  console.log(
    // 'ACTIVE ORDER :',
    // activeOrder,
    // 'DRIVER LOCATION :',
    // driverLocation,
    // 'ETA TO CUSTOMER : ',
    // etaToCustomer,
    // 'ETA TO VENDOR : ',
    // etaToVendor,
    ' POLYLINE TO CUSTOMER :',
    polylineToCustomer,
    ' POLYLINE TO VENDOR :',
    polylineToVendor,
  );

  function getBearing(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
  ) {
    const dLng = ((endLng - startLng) * Math.PI) / 180;

    const lat1 = (startLat * Math.PI) / 180;
    const lat2 = (endLat * Math.PI) / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);

    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  /**
   * -----------------------------
   * SAFE STATUS NORMALIZATION
   * -----------------------------
   */
  function normalizeStatus(status?: string) {
    if (!status) return 'IDLE';

    switch (status) {
      case 'ORDER_ASSIGNED':
      case 'ASSIGNED':
        return 'TO_VENDOR';

      case 'PICKED_UP':
        return 'TO_CUSTOMER';

      case 'DELIVERED':
        return 'DELIVERED';

      default:
        return 'IDLE';
    }
  }

  const deliveryPhase = useMemo(() => {
    return normalizeStatus(activeOrder?.order_status);
  }, [activeOrder?.order_status]);

  const isPickupActive = deliveryPhase === 'TO_VENDOR';
  const isCustomerActive =
    deliveryPhase === 'TO_CUSTOMER' || deliveryPhase === 'DELIVERED';

  /**
   * -----------------------------
   * POLYLINE SELECTION
   * -----------------------------
   */
  const activePolyline =
    deliveryPhase === 'TO_VENDOR' ? polylineToVendor : polylineToCustomer;

  const fullCoordinates = useMemo(() => {
    if (!activePolyline) return [];

    try {
      const decoded = polyline.decode(activePolyline) as [number, number][];

      return decoded
        .map(([lat, lng]) => ({
          latitude: Number(lat),
          longitude: Number(lng),
        }))
        .filter(
          (p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude),
        );
    } catch (error) {
      console.log('❌ polyline decode error:', error);
      return [];
    }
  }, [activePolyline]);

  const routeProgressRef = useRef(0);

  useEffect(() => {
    routeProgressRef.current = 0;
  }, [activePolyline, deliveryPhase]);

  const coordinates = useMemo(() => {
    if (fullCoordinates.length < 2) {
      return fullCoordinates;
    }

    if (!driverLocation) {
      return fullCoordinates;
    }

    const result = trimPolyline(
      fullCoordinates,
      {
        latitude: driverLocation.lat,
        longitude: driverLocation.lng,
      },
      routeProgressRef.current,
    );

    if (!result.coordinates.length) {
      return fullCoordinates;
    }

    /**
     * Only move forward.
     *
     * This prevents GPS noise from making the route jump
     * backwards when the driver's location fluctuates slightly.
     */
    if (result.index >= routeProgressRef.current) {
      routeProgressRef.current = result.index;
    }

    return result.coordinates;
  }, [fullCoordinates, driverLocation]);

  /**
   * -----------------------------
   * MAP REFS
   * -----------------------------
   */
  const mapRef = useRef<MapView>(null);

  const hasCentered = useRef(false);

  const previousLocation = useRef<{
    lat: number;
    lng: number;
  } | null>(null);

  const userInteracting = useRef(false);

  useEffect(() => {
    if (!driverLocation) return;

    if (hasCentered.current) return;

    hasCentered.current = true;

    mapRef.current?.animateCamera({
      center: {
        latitude: driverLocation.lat,
        longitude: driverLocation.lng,
      },
      zoom: 16,
    });
  }, [driverLocation]);

  useEffect(() => {
    if (!driverLocation) return;

    if (previousLocation.current) {
      const bearing = getBearing(
        previousLocation.current.lat,
        previousLocation.current.lng,
        driverLocation.lat,
        driverLocation.lng,
      );

      setCarRotation(bearing);
    }

    previousLocation.current = {
      lat: driverLocation.lat,
      lng: driverLocation.lng,
    };
  }, [driverLocation]);

  const hasFittedRoute = useRef(false);

  useEffect(() => {
    if (!isMapReady) return;
    if (coordinates.length < 2) return;
    if (hasFittedRoute.current) return;

    hasFittedRoute.current = true;

    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 180,
        right: 70,
        left: 70,
        bottom: 260,
      },
      animated: true,
    });
  }, [coordinates, isMapReady]);

  useEffect(() => {
    if (!driverLocation || !isMapReady) return;
    if (userInteracting.current) return;

    mapRef.current?.animateCamera(
      {
        center: {
          latitude: driverLocation.lat,
          longitude: driverLocation.lng,
        },
        heading: carRotation,
        pitch: 55,
        zoom: 17,
      },
      {
        duration: CAMERA_ANIMATION_DURATION,
      },
    );
  }, [driverLocation, carRotation, isMapReady]);

  const driverAnimatedCoordinate = useRef(
    new AnimatedRegion({
      latitude:
        Number(driverLocation?.lat) ||
        Number(activeOrder?.pickup_location?.latitude),
      longitude:
        Number(driverLocation?.lng) ||
        Number(activeOrder?.pickup_location?.longitude),
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    }),
  ).current;

  useEffect(() => {
    if (!driverLocation) return;

    driverAnimatedCoordinate
      .timing({
        latitude: Number(driverLocation.lat),
        longitude: Number(driverLocation.lng),
        duration: LOCATION_ANIMATION_DURATION,
        useNativeDriver: false,
      } as any)
      .start();
  }, [driverLocation]);
  /**
   * -----------------------------
   * ETA HANDLING (SAFE)
   * -----------------------------
   */
  const etaText = useMemo(() => {
    const etaValue =
      deliveryPhase === 'TO_CUSTOMER' ? etaToCustomer : etaToVendor;

    if (etaValue == null) return 'Waiting...';

    if (etaValue < 60) return `${etaValue} sec`;

    return `${Math.ceil(etaValue / 60)} min`;
  }, [etaToCustomer, etaToVendor, deliveryPhase]);

  /**
   * -----------------------------
   * TRACKING MESSAGE
   * -----------------------------
   */
  const trackingMessage = useMemo(() => {
    if (isPickupActive) return 'Driver is heading to vendor';
    if (isCustomerActive) return 'Driver is heading to customer';
    if (activeOrder?.order_status === 'PICKED_UP') return 'Order picked up';
    if (activeOrder?.order_status === 'DELIVERED') return 'Delivered';
    return 'Waiting...';
  }, [isPickupActive, isCustomerActive, activeOrder?.order_status]);

  /**
   * INITIAL MAP REGION - MOVED BEFORE GUARD
   */
  const initialMapRegion = useMemo(() => {
    const driverLat = Number(driverLocation?.lat);
    const driverLng = Number(driverLocation?.lng);

    const pickupLat = Number(activeOrder?.pickup_location?.latitude);
    const pickupLng = Number(activeOrder?.pickup_location?.longitude);

    const routePoint = coordinates[Math.floor(coordinates.length / 2)];

    return {
      latitude: Number.isFinite(driverLat)
        ? driverLat
        : (routePoint?.latitude ?? pickupLat ?? 0),

      longitude: Number.isFinite(driverLng)
        ? driverLng
        : (routePoint?.longitude ?? pickupLng ?? 0),

      latitudeDelta: 0.035,
      longitudeDelta: 0.035,
    };
  }, [
    driverLocation,
    coordinates,
    activeOrder?.pickup_location?.latitude,
    activeOrder?.pickup_location?.longitude,
  ]);

  const focusLocation = driverLocation
    ? {
        latitude: driverLocation.lat,
        longitude: driverLocation.lng,
      }
    : activeOrder
      ? deliveryPhase === 'TO_VENDOR'
        ? {
            latitude: activeOrder.pickup_location.latitude,
            longitude: activeOrder.pickup_location.longitude,
          }
        : {
            latitude: activeOrder.dropoff_location.latitude,
            longitude: activeOrder.dropoff_location.longitude,
          }
      : null;

  /**
   * SAFE GUARD (WAIT FOR WEBSOCKET OR TIMEOUT)
   */
  if (!activeOrder?.order_id) {
    if (isWaitingForOrder) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.background,
          }}
        >
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: Colors.backgroundTertiary,
              },
            ]}
          >
            <Ionicons
              name="hourglass-outline"
              size={scale(36)}
              color={Colors.textMuted }
            />
          </View>

          <Text
            style={{
              fontSize: 16,
              color: Colors.textMuted,
              fontFamily: Fonts.brandMedium,
            }}
          >
            Loading delivery details
          </Text>
        </View>
      );
    }
    return <NoActiveJob />;
  }

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

  const handleConfirmDelivery = () => {
    if (!activeOrder?.order_id) {
      return;
    }

    setSelectedOrderId(activeOrder.order_id);

    setShowConfirmDeliveryModal(true);
  };

  const handleChat = () => {
    if (!activeOrder?.order_id) {
      return;
    }

    router.push(`/active/${activeOrder.order_id}`);
  };

  // const mapStyle = [
  //   {
  //     featureType: 'poi',
  //     stylers: [{ visibility: 'off' }],
  //   },
  //   {
  //     featureType: 'transit',
  //     stylers: [{ visibility: 'off' }],
  //   },
  //   {
  //     featureType: 'administrative',
  //     stylers: [{ visibility: 'off' }],
  //   },
  //   {
  //     featureType: 'landscape',
  //     stylers: [{ saturation: -80 }],
  //   },
  //   {
  //     featureType: 'road',
  //     elementType: 'labels',
  //     stylers: [{ visibility: 'off' }],
  //   },
  //   {
  //     featureType: 'poi.business',
  //     stylers: [
  //       {
  //         visibility: 'off',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road.highway',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#d7dbe0',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'water',
  //     stylers: [
  //       {
  //         color: '#c9e8ff',
  //       },
  //     ],
  //   },
  // ];

  const mapStyle: any[] = [];

  const recenterDriver = () => {
    if (!focusLocation) return;

    userInteracting.current = false;

    mapRef.current?.animateCamera(
      {
        center: focusLocation,
        zoom: 17,
        heading: driverLocation ? carRotation : 0,
        pitch: driverLocation ? 60 : 0,
      },
      {
        duration: 700,
      },
    );
  };
  console.log('Storeeeeeeeeee Logooooo:', activeOrder.store_logo);

  const driverMarkerCoordinate = driverLocation
    ? {
        latitude: driverLocation.lat,
        longitude: driverLocation.lng,
      }
    : deliveryPhase === 'TO_VENDOR'
      ? {
          latitude: activeOrder.pickup_location.latitude,
          longitude: activeOrder.pickup_location.longitude,
        }
      : {
          latitude: activeOrder.dropoff_location.latitude,
          longitude: activeOrder.dropoff_location.longitude,
        };

  return (
    <>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + insets.top }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={isDark ? '#A7F3D0' : '#6EE7B7'}
            progressViewOffset={HEADER_HEIGHT + insets.top + scale(12)}
          />
        }
      >
        <View style={styles.container}>
          {/* 1. Map Canvas Section */}

          <View style={styles.mapContainer}>
            <View
              style={{
                position: 'absolute',
                top: scale(20),
                left: scale(20),
                right: scale(20),

                backgroundColor: Colors.background,

                borderRadius: scale(18),

                padding: scale(16),
                flexDirection: 'row',
                alignItems: 'center',

                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,

                zIndex: 10,
              }}
            >
              <View
                style={{
                  width: scale(44),
                  height: scale(44),
                  borderRadius: scale(22),
                  backgroundColor: `${Colors.primary}15`,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={Colors.primary}
                />
              </View>

              <View style={{ marginLeft: scale(12) }}>
                <Text
                  style={{
                    fontFamily: Fonts.brandSemiBold,
                    fontSize: normalize(13),
                    color: Colors.text,
                  }}
                >
                  {etaText}
                </Text>

                <Text
                  style={{
                    color: Colors.textMuted,
                    marginTop: scale(2),
                    fontSize: normalize(11),
                    fontFamily: Fonts.brandMedium,
                  }}
                >
                  {trackingMessage}
                </Text>
              </View>
            </View>
            <MapView
              initialRegion={initialMapRegion}
              ref={mapRef}
              mapType="standard"
              provider={PROVIDER_GOOGLE}
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: scale(24),
                },
              ]}
              mapPadding={{
                top: 180,
                bottom: 40,
                left: 40,
                right: 40,
              }}
              onMapReady={() => setIsMapReady(true)}
              showsUserLocation={false}
              showsCompass
              customMapStyle={mapStyle}
              onPanDrag={() => {
                userInteracting.current = true;
                setIsFollowingDriver(false);
              }}
            >
              {/* Store */}

              <Marker
                tracksViewChanges={!storeLogoLoaded}
                coordinate={{
                  latitude: activeOrder.pickup_location.latitude,
                  longitude: activeOrder.pickup_location.longitude,
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,

                    backgroundColor: '#FFFFFF',

                    justifyContent: 'center',
                    alignItems: 'center',

                    borderWidth: 2,
                    borderColor: Colors.primary,

                    // Only add shadows on Android, iOS handles differently
                    ...Platform.select({
                      android: {
                        elevation: 8,
                      },
                      ios: {
                        shadowColor: 'transparent',
                        shadowOpacity: 0,
                      },
                    }),
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: Colors.primaryLight,
                    }}
                  >
                    {activeOrder.store_logo && storeLogoLoaded ? (
                      <Image
                        source={{
                          uri: activeOrder.store_logo,
                          cache: 'force-cache',
                        }}
                        onLoad={() => setStoreLogoLoaded(true)}
                        onError={() => setStoreLogoLoaded(false)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                        }}
                      />
                    ) : (
                      <Ionicons name="bag" size={16} color={Colors.primary} />
                    )}
                  </View>
                </View>
              </Marker>

              {/* <Marker
                coordinate={{
                  latitude: activeOrder.dropoff_location.latitude,
                  longitude: activeOrder.dropoff_location.longitude,
                }}
                pinColor="red"
              /> */}
              {/* Driver */}
              {driverLocation && (
                <Marker.Animated
                  coordinate={driverMarkerCoordinate}
                  flat
                  tracksViewChanges={false}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <View
                    style={{
                      width: scale(22),
                      height: scale(22),
                      borderRadius: scale(11),
                      backgroundColor: Colors.success,
                      borderWidth: 3,
                      borderColor: '#fff',
                      ...Platform.select({
                        ios: {
                          elevation: 5,
                          // shadowColor: '#000',
                          // shadowOpacity: 0.3,
                          // shadowRadius: 3,
                          // shadowOffset: { width: 0, height: 1 },
                        },
                        android: {
                          elevation: 5,
                        },
                      }),
                    }}
                  />
                </Marker.Animated>
              )}

              <Marker
                coordinate={{
                  latitude: activeOrder.dropoff_location.latitude,
                  longitude: activeOrder.dropoff_location.longitude,
                }}
                pinColor={Colors.success}
              />

              {coordinates.length > 0 && (
                <>
                  <Polyline
                    coordinates={coordinates}
                    strokeColor="#FFFFFF"
                    strokeWidth={10}
                    lineCap="round"
                    lineJoin="round"
                  />

                  <Polyline
                    coordinates={coordinates}
                    strokeColor="#000000"
                    strokeWidth={6}
                    lineCap="round"
                    lineJoin="round"
                  />
                </>
              )}
            </MapView>

            <TouchableOpacity
              onPress={recenterDriver}
              style={{
                position: 'absolute',
                bottom: 30,
                right: 20,
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                elevation: scale(20),
              }}
            >
              <Ionicons name="locate" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.statusContainer}>
            <View style={styles.statusContent}>
              <Ionicons name="car" size={scale(20)} color={Colors.success} />
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
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={styles.addressesContainerHeader}>
                <StatusDot active={isCustomerActive} />
                <Text style={styles.sectionLabel}>Customer Location</Text>
              </View>
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

              <View style={{ flex: 1 }}>
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

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button
                size="sm"
                onPress={handleChat}
                // variant="primary"
                leftIcon={
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={16}
                    color="#000000"
                  />
                }
              >
                Chat with Customer
              </Button>
            </View>
          </View>

          <View style={styles.card}>
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
              {activeOrder?.distance_meters && (
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Distance</Text>
                  <Text style={styles.metaValue}>
                    {(activeOrder?.distance_meters / 1000).toFixed(1)} km
                  </Text>
                </View>
              )}

              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Order ID</Text>

                <Text style={styles.metaValue}>{activeOrder.order_id}</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            {isPickupActive ? (
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
      color: Colors.text,
    },

    address: {
      marginTop: scale(4),
      fontSize: normalize(13),
      color: Colors.text,
      lineHeight: scale(20),
      fontFamily: Fonts.brandMedium,
      textTransform: 'capitalize',
      flexWrap: 'wrap',
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
      // borderTopWidth: 1,
      // borderTopColor: Colors.border,
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
      color: Colors.text,
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
      height: scale(360),
      borderRadius: scale(20),
      elevation: scale(2),
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      backgroundColor: '#EBF8FF',
      // overflow: 'visible',
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
