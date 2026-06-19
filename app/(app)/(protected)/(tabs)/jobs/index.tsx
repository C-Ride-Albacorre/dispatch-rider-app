import LocationPermissionModal from '@/components/layout/location-permission-modal';
import {
  HEADER_HEIGHT,
  useHeaderReset,
  useScrollHeader,
} from '@/components/layout/scroll-header-context';
import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import ErrorContent from '@/features/jobs/components/error';
import LoadingJobs from '@/features/jobs/components/loading-jobs';
import NoJobs from '@/features/jobs/components/no-job';
import RenderJobCard from '@/features/jobs/components/render-job-card';
import RenderJobHeader from '@/features/jobs/components/render-job-header';
import { useAvailableJobs } from '@/features/jobs/use-fetch';
import { useLocation } from '@/hooks/use-location';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { FlatList, Image } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Jobs() {
  const insets = useSafeAreaInsets();
  const resetHeader = useHeaderReset();

  useFocusEffect(
    useCallback(() => {
      resetHeader();
    }, []),
  );

  const scrollHandler = useScrollHeader();

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const {
    location,
    loading: locationLoading,
    permissionStatus,
    showPermissionModal,
    requestPermission,
    dismissPermissionModal,
  } = useLocation();

  const { data, isLoading, error } = useAvailableJobs(
    location?.latitude,
    location?.longitude,
  );

  console.log('Available jobs:', data);

  const jobs = data?.data ?? [];

  const renderListHeader = useCallback(
    () => <RenderJobHeader jobs={jobs} />,
    [jobs],
  ); // Only re-creates if the jobs array size changes

  const renderEmptyState = useCallback(() => <NoJobs />, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => <RenderJobCard item={item} />,
    [],
  );

  // Checking permission status on first mount
  if (permissionStatus === 'checking') {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <View
          style={[styles.iconWrapper, { backgroundColor: Colors.primaryLight }]}
        >
          <Ionicons
            name="location-outline"
            size={scale(36)}
            color={Colors.primary}
          />
        </View>
        <Text style={styles.loadingText}>Checking location access...</Text>
      </View>
    );
  }

  // Permission explicitly denied — show actionable blocked state
  if (permissionStatus === 'denied') {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center', gap: scale(16) },
        ]}
      >
        <View
          style={[styles.iconWrapper, { backgroundColor: Colors.primaryLight }]}
        >
          <Ionicons
            name="location-outline"
            size={scale(36)}
            color={Colors.textMuted}
          />
        </View>
        <Text style={[styles.title, { textAlign: 'center' }]}>
          Location Access Required
        </Text>
        <Text
          style={[
            styles.loadingText,
            {
              color: Colors.textSecondary,
              textAlign: 'center',
              fontFamily: Fonts.brandRegular,
            },
          ]}
        >
          C-Ride needs your location to show nearby delivery jobs. Please enable
          location access in your device settings.
        </Text>
        <LocationPermissionModal
          visible={showPermissionModal}
          onAllow={requestPermission}
          onDeny={dismissPermissionModal}
        />
      </View>
    );
  }

  if (locationLoading || isLoading) {
    return (
      <>
        <LocationPermissionModal
          visible={showPermissionModal}
          onAllow={requestPermission}
          onDeny={dismissPermissionModal}
        />

        <LoadingJobs />
      </>
    );
  }

  if (error) {
    return <ErrorContent error={error} />;
  }

  return (
    <>
      <LocationPermissionModal
        visible={showPermissionModal}
        onAllow={requestPermission}
        onDeny={dismissPermissionModal}
      />

      <Animated.FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.order_id}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + insets.top + scale(12),
          paddingBottom: scale(32),
          paddingHorizontal: scale(16),
        }}
        ItemSeparatorComponent={() => <View style={{ height: scale(14) }} />}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={!isLoading && renderEmptyState}
      />
    </>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(20),
      paddingVertical: scale(24),
      backgroundColor: Colors.background,
      gap: scale(16),
    },

    iconWrapper: {
      width: scale(72),
      height: scale(72),
      borderRadius: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: scale(16),
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
    },

    loadingText: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
    },
  });
