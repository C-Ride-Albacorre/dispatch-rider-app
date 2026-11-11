import ScreenHeader from '@/components/layout/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import DeliveryDetailsModal from '@/features/home/components/delivery-details-modal';
import RecentDeliverySkeleton from '@/features/home/components/recent-delivery-skeleton';
import RenderRecentDeliveries from '@/features/home/components/render-recent-deliveries';
import {
  DeliveryHistoryStatus,
  RecentDelivery,
  useDeliveryHistory,
} from '@/features/home/use-fetch';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

type HistoryFilter = 'ALL' | DeliveryHistoryStatus;

const FILTERS: { label: string; value: HistoryFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Picked up', value: 'PICKED_UP' },
];

const EMPTY_MESSAGES: Record<HistoryFilter, string> = {
  ALL: 'Orders you take will show up here.',
  DELIVERED: "You haven't completed any deliveries yet.",
  PICKED_UP: 'No orders are waiting to be delivered.',
  CANCELLED: 'No cancelled orders.',
};

export default function OrderHistoryScreen() {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const [filter, setFilter] = useState<HistoryFilter>('ALL');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const {
    data,
    isLoading,
    isError,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDeliveryHistory(filter === 'ALL' ? undefined : filter);

  const orders = useMemo(() => {
    const seen = new Set<string>();

    return (data?.pages ?? [])
      .flatMap((page) => page?.data ?? [])
      .filter((order) => {
        if (seen.has(order.assignmentId)) return false;
        seen.add(order.assignmentId);
        return true;
      });
  }, [data]);

  const total = data?.pages?.[0]?.total;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const renderEmpty = () => {
    if (isLoading) {
      return <RecentDeliverySkeleton count={6} />;
    }

    if (isError) {
      return (
        <View style={styles.state}>
          <View style={[styles.iconCircle, styles.iconCircleError]}>
            <Ionicons
              name="cloud-offline-outline"
              size={20}
              color={Colors.error}
            />
          </View>
          <ThemedText style={styles.stateTitle}>
            Couldn&apos;t load your orders
          </ThemedText>
          <ThemedText style={styles.stateMessage} themeColor="textMuted">
            Check your connection and try again.
          </ThemedText>
          <Button size="sm" variant="chip" onPress={() => refetch()}>
            Try again
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.state}>
        <View style={styles.iconCircle}>
          <Ionicons name="receipt-outline" size={20} color={Colors.textMuted} />
        </View>
        <ThemedText style={styles.stateTitle}>No orders yet</ThemedText>
        <ThemedText style={styles.stateMessage} themeColor="textMuted">
          {EMPTY_MESSAGES[filter]}
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.flex}>
      <StatusBar style="auto" />

      <ScreenHeader
        title="Order history"
        subtitle={
          total != null
            ? `${total} ${total === 1 ? 'order' : 'orders'}`
            : undefined
        }
        onBack={() => router.back()}
      />

      <View style={styles.filters}>
        {FILTERS.map(({ label, value }) => (
          <Button
            key={value}
            size="xs"
            variant={filter === value ? 'chipActive' : 'chip'}
            onPress={() => setFilter(value)}
          >
            {label}
          </Button>
        ))}
      </View>

      <FlatList<RecentDelivery>
        data={orders}
        keyExtractor={(item) => item.assignmentId}
        renderItem={({ item }) => (
          <RenderRecentDeliveries
            delivery={item}
            onPress={() => {
              setSelectedOrderId(item.orderId);
              setShowDetailsModal(true);
            }}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              style={styles.footerLoader}
              color={Colors.primary}
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={() => refetch()}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />

      <DeliveryDetailsModal
        visible={showDetailsModal}
        orderId={selectedOrderId}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedOrderId(null);
        }}
      />
    </ThemedView>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    filters: {
      flexDirection: 'row',
      gap: Spacing.two,
      paddingHorizontal: Spacing.three,
      paddingBottom: Spacing.three,
    },

    list: {
      flexGrow: 1,
      gap: Spacing.two,
      paddingHorizontal: Spacing.three,
      paddingBottom: Spacing.five,
    },

    footerLoader: {
      paddingVertical: Spacing.four,
    },

    state: {
      alignItems: 'center',
      gap: Spacing.two,
      paddingVertical: Spacing.six,
      paddingHorizontal: Spacing.four,
    },

    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.backgroundTertiary,
      marginBottom: Spacing.one,
    },

    iconCircleError: {
      backgroundColor: Colors.errorLight,
    },

    stateTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    stateMessage: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
      marginBottom: Spacing.two,
    },
  });
