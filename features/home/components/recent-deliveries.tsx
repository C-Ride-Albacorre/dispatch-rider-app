import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRecentDeliveries } from '../use-fetch';
import DeliveryDetailsModal from './delivery-details-modal';
import NoRecentDelivery from './no-recent-delivery';
import RenderRecentDeliveries from './render-recent-deliveries';
import RecentDeliverySkeleton from './recent-delivery-skeleton';

export default function RecentDeliveries() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { data, isLoading, error } = useRecentDeliveries();

  const recentDeliveries = data?.data ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.title}>Recent deliveries</ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textMuted">
            Your latest completed drop-offs
          </ThemedText>
        </View>

        <Pressable
          onPress={() => router.push('/(app)/(protected)/(tabs)/home/history')}
          hitSlop={8}
          style={({ pressed }) => [styles.seeAll, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="See all order history"
        >
          <ThemedText style={styles.seeAllText} themeColor="primary">
            See all
          </ThemedText>
          <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
        </Pressable>
      </View>

      {error ? (
        <View style={styles.errorState}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="cloud-offline-outline"
              size={20}
              color={Colors.error}
            />
          </View>
          <ThemedText style={styles.errorTitle}>
            Couldn&apos;t load deliveries
          </ThemedText>
          <ThemedText style={styles.errorMessage} themeColor="textMuted">
            Error loading recent deliveries. Pull down to try again.
          </ThemedText>
        </View>
      ) : isLoading ? (
        <RecentDeliverySkeleton count={3} />
      ) : recentDeliveries.length > 0 ? (
        <View style={styles.list}>
          {recentDeliveries.map((delivery) => (
            <RenderRecentDeliveries
              key={delivery.assignmentId}
              delivery={delivery}
              onPress={() => {
                setSelectedOrderId(delivery.orderId);
                setShowDetailsModal(true);
              }}
            />
          ))}
        </View>
      ) : (
        <NoRecentDelivery />
      )}

      <DeliveryDetailsModal
        visible={showDetailsModal}
        orderId={selectedOrderId}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedOrderId(null);
        }}
      />
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      gap: Spacing.three,
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
    },

    sectionHeader: {
      flex: 1,
      gap: 2,
    },

    seeAll: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      paddingVertical: Spacing.one,
      paddingHorizontal: Spacing.two,
      borderRadius: 999,
      backgroundColor: Colors.primaryExtraLight,
    },

    seeAllText: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 13,
      lineHeight: 18,
    },

    pressed: {
      opacity: 0.7,
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

    list: {
      gap: Spacing.two,
    },

    errorState: {
      alignItems: 'center',
      gap: Spacing.two,
      paddingVertical: Spacing.five,
      paddingHorizontal: Spacing.four,
    },

    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.errorLight,
      marginBottom: Spacing.one,
    },

    errorTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    errorMessage: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
    },
  });
