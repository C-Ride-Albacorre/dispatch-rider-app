import ScreenHeader from '@/components/layout/screen-header';
import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import IconButton from '@/components/ui/buttons/icon-button';
import { Fonts, Spacing } from '@/constants/theme';
import ConfirmDeclineRequest from '@/features/active/confirm-decline-request';
import ConfirmDelivery from '@/features/active/confirm-delivery';
import ConfirmPickup from '@/features/active/confirm-pickup';
import NoActiveJob from '@/features/active/no-active-job';
import StatusDot from '@/features/active/status-dot';
import { useOrderTracking } from '@/features/active/use-fetch';
import { formatDate } from '@/helpers/date-formatter';
import { useTheme } from '@/hooks/use-theme';
import { useDriverJobsStore } from '@/store/driver-jobs-store';
import { trimPolyline } from '@/utils/trim-polyline';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import polyline from '@mapbox/polyline';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import MapView, {
  AnimatedRegion,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LOCATION_ANIMATION_DURATION = 450;

const CAMERA_ANIMATION_DURATION = 350;

// The collapsed sheet covers the bottom 40%, leaving 60% of the screen for the map
const SHEET_COLLAPSED_RATIO = 0.4;

const MAP_CONTROL_SIZE = 48;

const MAP_CONTROLS_GAP = 10;

const MAP_CONTROLS_HEIGHT = MAP_CONTROL_SIZE * 2 + MAP_CONTROLS_GAP;

// Space at the end of the sheet content so the sticky footer doesn't cover it
const SHEET_FOOTER_SPACE = 104;

export default function ActiveDeliveryContent() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const insets = useSafeAreaInsets();

  const sheetRef = useRef<BottomSheet>(null);

  const sheetIndexRef = useRef(0);

  // The sheet must never close: layout changes (tab switch, returning from
  // chat, app resume) can leave it at index -1, so bring it back to the
  // collapsed snap point
  const handleSheetChange = useCallback((index: number) => {
    sheetIndexRef.current = index;

    if (index < 0) sheetRef.current?.snapToIndex(0);
  }, []);

  // Coming back to this tab, make sure the sheet is open again
  useFocusEffect(
    useCallback(() => {
      if (sheetIndexRef.current < 0) sheetRef.current?.snapToIndex(0);
    }, []),
  );

  // The map runs edge to edge; floating controls sit below the status bar
  const mapTopInset = insets.top;

  const [containerHeight, setContainerHeight] = useState(0);

  const collapsedSheetHeight = containerHeight * SHEET_COLLAPSED_RATIO;

  // Top edge of the bottom sheet, in screen-container coordinates
  const sheetPosition = useSharedValue(0);

  // Expanding stops at 70% so part of the map always stays visible
  const snapPoints = useMemo(() => ['40%', '70%'], []);

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

  // Computed on the JS thread so the worklet below only reads plain numbers
  const mapControlsOffset = MAP_CONTROLS_HEIGHT + Spacing.three;

  // Drivers can close the ETA card; it comes back when the delivery phase changes
  const [etaCardDismissedPhase, setEtaCardDismissedPhase] = useState<
    string | null
  >(null);

  const showEtaCard = etaCardDismissedPhase !== deliveryPhase;

  // Bottom edge of the ETA card (or the compact pill when it's closed)
  const etaCardBottom = mapTopInset + (showEtaCard ? 92 : 52);

  // Fade the buttons out only when they'd overlap the ETA card at the top
  const mapControlsFadeStart = etaCardBottom + mapControlsOffset;
  const mapControlsFadeEnd = mapControlsFadeStart + 60;

  // Refresh/recenter buttons ride just above the sheet and fade out as it expands
  const mapControlsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetPosition.value - mapControlsOffset }],
    opacity: interpolate(
      sheetPosition.value,
      [mapControlsFadeStart, mapControlsFadeEnd],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

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
    if (!containerHeight) return;
    if (coordinates.length < 2) return;
    if (hasFittedRoute.current) return;

    hasFittedRoute.current = true;

    // mapPadding already keeps the route clear of the header and the sheet
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 60,
        right: 60,
        left: 60,
        bottom: 60,
      },
      animated: true,
    });
  }, [coordinates, isMapReady, containerHeight]);

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

  // The map unmounts while there's no order; a remounted map must wait for
  // its own onMapReady before receiving padding
  const hasOrder = Boolean(activeOrder?.order_id);

  useEffect(() => {
    if (!hasOrder) setIsMapReady(false);
  }, [hasOrder]);

  // Decline/pickup/delivery clear the order before their modals can close
  // themselves (the modals unmount first), so close them here or they
  // reopen on the next job
  useEffect(() => {
    if (hasOrder) return;

    setShowConfirmDeclineModal(false);
    setShowConfirmPickupModal(false);
    setShowConfirmDeliveryModal(false);
  }, [hasOrder]);

  /**
   * SAFE GUARD (WAIT FOR WEBSOCKET OR TIMEOUT)
   */
  if (!activeOrder?.order_id) {
    if (isWaitingForOrder) {
      return (
        <View style={styles.screenBackground}>
          <StatusBar style="auto" />
          <ScreenHeader title="Active" />

          <View style={styles.loading}>
            <View style={styles.iconWrapper}>
              <Ionicons
                name="hourglass-outline"
                size={20}
                color={Colors.textMuted}
              />
            </View>

            <ThemedText style={styles.loadingText} themeColor="textMuted">
              Loading delivery details
            </ThemedText>
          </View>
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

  // Snap back to the driver's latest position and resume following them
  const recenterDriver = () => {
    if (!driverLocation) return;

    userInteracting.current = false;
    setIsFollowingDriver(true);

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

  const renderSheetFooter = (props: BottomSheetFooterProps) => (
    <BottomSheetFooter {...props}>
      <View style={styles.footer}>
        {isPickupActive ? (
          <View style={styles.footerRow}>
            <Button
              onPress={handleConfirmDecline}
              variant="redSecondary"
              size="lg"
              style={styles.flex}
            >
              Decline
            </Button>

            <Button
              onPress={handleConfirmPickup}
              variant="green"
              size="lg"
              style={styles.flex}
            >
              Confirm Pickup
            </Button>
          </View>
        ) : (
          <Button
            onPress={handleConfirmDelivery}
            variant="green"
            size="lg"
          >
            Confirm Delivery
          </Button>
        )}
      </View>
    </BottomSheetFooter>
  );

  return (
    <>
      <StatusBar style="auto" />

      <View
        style={styles.screen}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        {/* 1. Full-screen map behind the header and the bottom sheet */}

        <View style={StyleSheet.absoluteFill}>
          {showEtaCard ? (
            <View style={[styles.etaCard, { top: mapTopInset + Spacing.two }]}>
              <View style={styles.etaIcon}>
                <Ionicons name="time-outline" size={20} color={Colors.primary} />
              </View>

              <View style={styles.flex}>
                <ThemedText style={styles.etaValue}>{etaText}</ThemedText>

                <ThemedText style={styles.etaMessage} themeColor="textMuted">
                  {trackingMessage}
                </ThemedText>
              </View>

              <IconButton
                icon="close"
                size="sm"
                variant="secondary"
                onPress={() => setEtaCardDismissedPhase(deliveryPhase)}
                accessibilityLabel="Close ETA card"
              />
            </View>
          ) : (
            <Pressable
              onPress={() => setEtaCardDismissedPhase(null)}
              style={({ pressed }) => [
                styles.etaPill,
                { top: mapTopInset + Spacing.two },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Show ETA details"
            >
              <Ionicons name="time-outline" size={16} color={Colors.primary} />
              <ThemedText style={styles.etaPillText}>{etaText}</ThemedText>
            </Pressable>
          )}
          <MapView
            initialRegion={initialMapRegion}
            ref={mapRef}
            mapType="standard"
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFill}
            // Android crashes (NPE in GoogleMap.setPadding) if padding changes
            // after layout but before the native map exists, so hold it back
            // until onMapReady
            mapPadding={
              isMapReady
                ? {
                    top: etaCardBottom,
                    bottom: collapsedSheetHeight,
                    left: 40,
                    right: 40,
                  }
                : undefined
            }
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

                  backgroundColor: Colors.white,

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
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: Colors.success,
                    borderWidth: 3,
                    borderColor: Colors.white,
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
        </View>

        <Animated.View style={[styles.mapControls, mapControlsStyle]}>
          <IconButton
            icon="refresh"
            size="lg"
            onPress={() => refetch()}
            loading={isFetching}
            style={styles.mapControlButton}
            accessibilityLabel="Refresh delivery"
          />

          <IconButton
            icon="locate"
            size="lg"
            onPress={recenterDriver}
            style={styles.mapControlButton}
            accessibilityLabel="Recenter on my location"
          />
        </Animated.View>

        {/* 2. Order details in a draggable bottom sheet */}

        <BottomSheet
          ref={sheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          enablePanDownToClose={false}
          enableDynamicSizing={false}
          topInset={mapTopInset}
          animatedPosition={sheetPosition}
          footerComponent={renderSheetFooter}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.sheetHandle}
        >
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetContent}
          >
            <ThemedText style={styles.sheetTitle}>
              Order #{activeOrder.order_number}
            </ThemedText>

            <View style={styles.card}>
              <View style={styles.addressesContainerHeader}>
                <StatusDot active={isPickupActive} />
                <ThemedText style={styles.sectionLabel} themeColor="textMuted">
                  Vendor location
                </ThemedText>
              </View>

              <View style={styles.storeRow}>
                <Image
                  source={{
                    uri: activeOrder.store_logo,
                  }}
                  style={styles.logo}
                />

                <View style={styles.stopBody}>
                  <ThemedText style={styles.storeName}>
                    {activeOrder.store_name}
                  </ThemedText>

                  <ThemedText style={styles.address} themeColor="textSecondary">
                    {activeOrder?.pickup_location?.address ?? 'N/A'}
                  </ThemedText>

                  <ThemedText style={styles.coordinates} themeColor="textMuted">
                    {activeOrder.store_lat.toFixed(5)},{' '}
                    {activeOrder.store_lng.toFixed(5)}
                  </ThemedText>
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
              <View style={styles.cardHeaderRow}>
                <View style={styles.addressesContainerHeader}>
                  <StatusDot active={isCustomerActive} />
                  <ThemedText style={styles.sectionLabel} themeColor="textMuted">
                    Customer location
                  </ThemedText>
                </View>
              </View>

              <View style={styles.addressesContainerRow}>
                <View style={styles.addressWrapper}>
                  <Ionicons name="location" size={20} color={Colors.success} />
                </View>

                <View style={styles.stopBody}>
                  <ThemedText style={styles.customerAddress}>
                    {activeOrder.dropoff_location.address}
                  </ThemedText>

                  <ThemedText style={styles.city} themeColor="textMuted">
                    {activeOrder.dropoff_location.city},{' '}
                    {activeOrder.dropoff_location.state}
                  </ThemedText>

                  <ThemedText style={styles.city} themeColor="textMuted">
                    {activeOrder.dropoff_location.country}
                  </ThemedText>

                  <ThemedText style={styles.city} themeColor="textMuted">
                    {activeOrder.dropoff_location.postalCode}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.chatRow}>
                <Button
                  size="sm"
                  variant="chip"
                  onPress={handleChat}
                  leftIcon={
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={16}
                      color={Colors.textSecondary}
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
                  <ThemedText style={styles.metaLabel} themeColor="textMuted">
                    Created
                  </ThemedText>
                  <ThemedText style={styles.metaValue}>
                    {formatDate(activeOrder.created_at)}
                  </ThemedText>
                </View>
                <View style={styles.metaItem}>
                  <ThemedText style={styles.metaLabel} themeColor="textMuted">
                    Assigned
                  </ThemedText>
                  <ThemedText style={styles.metaValue}>
                    {formatDate(activeOrder.assigned_at)}
                  </ThemedText>
                </View>
                {activeOrder?.distance_meters && (
                  <View style={styles.metaItem}>
                    <ThemedText style={styles.metaLabel} themeColor="textMuted">
                    Distance
                  </ThemedText>
                    <ThemedText style={styles.metaValue}>
                      {(activeOrder?.distance_meters / 1000).toFixed(1)} km
                    </ThemedText>
                  </View>
                )}
                <View style={styles.metaItem}>
                  <ThemedText style={styles.metaLabel} themeColor="textMuted">
                    Order ID
                  </ThemedText>
                  <ThemedText style={styles.metaValue}>{activeOrder.order_id}</ThemedText>
                </View>
              </View>
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>

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
    screen: {
      flex: 1,
    },

    flex: {
      flex: 1,
    },

    pressed: {
      opacity: 0.8,
    },

    screenBackground: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      paddingBottom: Spacing.six,
    },

    loadingText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
    },

    iconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.backgroundTertiary,
    },

    // Floating ETA card over the map
    etaCard: {
      position: 'absolute',
      left: Spacing.three,
      right: Spacing.three,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      shadowColor: Colors.black,
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
      zIndex: 10,
    },

    etaIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.primaryExtraLight,
    },

    etaValue: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    etaMessage: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    etaPill: {
      position: 'absolute',
      left: Spacing.three,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: Spacing.two,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      shadowColor: Colors.black,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 6,
      zIndex: 10,
    },

    etaPillText: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 13,
      lineHeight: 18,
    },

    mapControls: {
      position: 'absolute',
      top: 0,
      right: Spacing.three,
      gap: MAP_CONTROLS_GAP,
    },

    mapControlButton: {
      backgroundColor: Colors.card,
      shadowColor: Colors.black,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 6,
    },

    // Bottom sheet
    sheetBackground: {
      backgroundColor: Colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },

    sheetHandle: {
      width: 40,
      height: 5,
      borderRadius: 3,
      backgroundColor: Colors.border,
    },

    sheetContent: {
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.one,
      paddingBottom: SHEET_FOOTER_SPACE,
      gap: 12,
    },

    sheetTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
    },

    card: {
      gap: 12,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
    },

    cardHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    sectionLabel: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    },

    addressesContainerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    addressesContainerRow: {
      flexDirection: 'row',
      gap: 12,
    },

    storeRow: {
      flexDirection: 'row',
      gap: 12,
    },

    stopBody: {
      flex: 1,
      gap: 2,
    },

    logo: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: Colors.backgroundTertiary,
    },

    addressWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.successExtraLight,
    },

    storeName: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
      textTransform: 'capitalize',
    },

    address: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
      textTransform: 'capitalize',
    },

    customerAddress: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
      textTransform: 'capitalize',
    },

    city: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    coordinates: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    chatRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },

    metaGrid: {
      gap: 12,
    },

    metaItem: {
      flex: 1,
      gap: 2,
    },

    metaLabel: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    metaValue: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
    },

    // Sticky footer with the delivery actions
    footer: {
      paddingHorizontal: Spacing.three,
      paddingTop: 12,
      paddingBottom: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.border,
      backgroundColor: Colors.background,
    },

    footerRow: {
      flexDirection: 'row',
      gap: 12,
    },
  });
