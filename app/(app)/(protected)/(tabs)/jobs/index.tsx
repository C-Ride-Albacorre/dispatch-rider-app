import LocationPermissionModal from '@/components/layout/location-permission-modal';
import {
  HEADER_HEIGHT,
  useHeaderReset,
  useScrollHeader,
} from '@/components/layout/scroll-header-context';
import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import LoadingJobs from '@/features/jobs/components/loading-jobs';
import { useAvailableJobs } from '@/features/jobs/use-fetch';
import { useLocation } from '@/hooks/use-location';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Job = {
  id: string;
  type: string;
  category: string;
  amount: number;
  pickup: string;
  dropoff: string;
  distance: string;
  time: string;
  items: string;
};

// const jobs: Job[] = [
//   {
//     id: 'CR-2847',
//     type: 'Express',
//     category: 'Premium',
//     amount: 4500,
//     pickup: 'The Place Restaurant, VI',
//     dropoff: 'Plot 15, Adeola Odeku St',
//     distance: '3.2 km',
//     time: '2:00–2:30 PM',
//     items: '2 items',
//   },
//   {
//     id: 'CR-2848',
//     type: 'Standard',
//     category: 'Food',
//     amount: 3200,
//     pickup: 'Chicken Republic, Lekki',
//     dropoff: 'Chevron Drive, Lekki',
//     distance: '5.1 km',
//     time: '3:00–3:30 PM',
//     items: '1 item',
//   },
//   {
//     id: 'CR-2849',
//     type: 'Express',
//     category: 'Premium',
//     amount: 6200,
//     pickup: 'Dominos Pizza, Victoria Island',
//     dropoff: 'Banana Island',
//     distance: '4.5 km',
//     time: '2:15–2:45 PM',
//     items: '3 items',
//   },
// ];

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

  let borderColor = Colors.primary;

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
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <View
          style={[styles.iconWrapper, { backgroundColor: Colors.errorLight }]}
        >
          <Ionicons
            name="warning-outline"
            size={scale(36)}
            color={Colors.error}
          />
        </View>
        <View style={{  alignItems: 'center' }}>
          <Text
            style={{
              color: Colors.error,
              fontFamily: Fonts.brandMedium,
              fontSize: scale(16),
            }}
          >
            Failed to load jobs
          </Text>
          <Text
            style={{
              ...styles.loadingText,
              color: Colors.textMuted,
              fontFamily: Fonts.brandRegular,
            }}
          >
            {error?.message ?? `Failed to load jobs. Please try again.`}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <LocationPermissionModal
        visible={showPermissionModal}
        onAllow={requestPermission}
        onDeny={dismissPermissionModal}
      />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + insets.top,
          paddingBottom: scale(32),
        }}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Available Jobs</Text>

            <Text style={styles.subtitle}>{jobs.length} nearby</Text>
          </View>

          {jobs.map((job: any) => (
            <View
              key={job.id}
              style={[
                styles.jobCard,
                { borderTopColor: borderColor, borderTopWidth: 4 },
              ]}
            >
              {/* Header */}
              <View style={styles.jobHeader}>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobId}>#{job.id}</Text>

                  <Text style={styles.jobType}>{job.type}</Text>

                  <Text style={styles.jobCategory}>{job.category}</Text>
                </View>

                <Text style={styles.jobPrice}>
                  ₦{job.amount.toLocaleString()}
                </Text>
              </View>

              <View style={styles.divider} />

              {/* Timeline */}
              <View style={styles.timeline}>
                <View style={styles.timelineColumn}>
                  <View
                    style={[styles.dot, { backgroundColor: Colors.success }]}
                  />

                  <View style={styles.connector} />

                  <View style={styles.dot} />
                </View>

                <View style={styles.timelineContent}>
                  <Text style={styles.jobLocationText}>{job.pickup}</Text>

                  <Text style={styles.jobLocationText}>{job.dropoff}</Text>
                </View>
              </View>

              {/* Meta */}
              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={Colors.textMuted}
                  />

                  <Text style={styles.jobMetaText}>{job.distance}</Text>
                </View>

                <View style={styles.metaChip}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={Colors.textMuted}
                  />

                  <Text style={styles.jobMetaText}>{job.time}</Text>
                </View>

                <View style={styles.metaChip}>
                  <Ionicons
                    name="cube-outline"
                    size={14}
                    color={Colors.textMuted}
                  />

                  <Text style={styles.jobMetaText}>{job.items}</Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.jobActions}>
                <Button variant="outline">Decline</Button>

                <Button variant="primary" size="sm" style={styles.acceptBtn}>
                  Accept · ₦{job.amount.toLocaleString()}
                </Button>
              </View>
            </View>
          ))}
        </View>
      </Animated.ScrollView>
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

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(8),
    },

    loadingText: {
      fontSize: normalize(14),
      color: Colors.primary,
      fontFamily: Fonts.brandMedium,
    },

    iconWrapper: {
      width: scale(72),
      height: scale(72),
      borderRadius: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
    },

    title: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },

    subtitle: {
      fontSize: normalize(13),
      color: Colors.success,
      fontFamily: Fonts.brandMedium,
    },

    jobCard: {
      borderRadius: scale(16),

      borderWidth: 1,
      borderColor: Colors.border,

      shadowColor: Colors.shadow,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.08,
      shadowRadius: 12,

      elevation: 3,
    },

    jobHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',

      padding: scale(16),
    },

    jobInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: scale(8),
      flex: 1,
      marginRight: scale(8),
    },

    jobId: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandSemiBold,
      color: Colors.text,
    },

    jobType: {
      fontSize: normalize(11),
      color: Colors.error,
      backgroundColor: Colors.errorLight,
      paddingHorizontal: scale(8),
      paddingVertical: scale(4),
      borderRadius: scale(20),
      overflow: 'hidden',
      fontFamily: Fonts.brandMedium,
    },

    jobCategory: {
      fontSize: normalize(11),
      color: Colors.text,
      backgroundColor: Colors.primaryLight,
      paddingHorizontal: scale(8),
      paddingVertical: scale(4),
      borderRadius: scale(20),
      overflow: 'hidden',
      fontFamily: Fonts.brandMedium,
    },

    jobPrice: {
      fontSize: normalize(18),
      color: Colors.primary,
      fontFamily: Fonts.brandSemiBold,
    },

    divider: {
      height: 1,
      backgroundColor: Colors.border,
    },
    timeline: {
      flexDirection: 'row',
      gap: scale(12),

      padding: scale(16),
    },

    timelineColumn: {
      width: scale(12),
      alignItems: 'center',
    },

    dot: {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(999),
      backgroundColor: Colors.primary,
    },

    connector: {
      width: scale(2),
      flex: 1,
      minHeight: scale(28),
      backgroundColor: Colors.border,
      marginVertical: scale(4),
    },

    timelineContent: {
      flex: 1,
      justifyContent: 'space-between',
      gap: scale(24),
    },

    jobLocationText: {
      fontSize: normalize(14),
      color: Colors.text,
      fontFamily: Fonts.brandMedium,
    },

    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: scale(8),
      paddingHorizontal: scale(16),
    },

    metaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(4),

      paddingHorizontal: scale(10),
      paddingVertical: scale(6),

      borderRadius: scale(999),

      backgroundColor: Colors.backgroundSecondary ?? Colors.background,
    },

    jobMetaText: {
      fontSize: normalize(12),
      color: Colors.textMuted,
      fontFamily: Fonts.brandMedium,
    },

    jobActions: {
      flexDirection: 'row',
      gap: scale(10),

      padding: scale(16),
    },

    actionBtn: {
      flex: 1,
    },

    acceptBtn: {
      flex: 1,
    },
  });
