import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  /*
   * Flatten all pages into one array.
   */
  // const recentDeliveries = data?.pages.flatMap((page) => page.data) ?? [];

  // console.log('Recent Deliveries:', recentDeliveries);

  // console.log('Pagination:', data?.pages);

  // const renderItem = useCallback(({ item }: { item: RecentDelivery }) => {
  //   return <RenderRecentDeliveries delivery={item} />;
  // }, []);

  // const renderEmptyComponent = useCallback(() => {
  //   return <NoRecentDelivery />;
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Deliveries</Text>

      {error ? (
        <Text
          style={{
            color: Colors.error,
            textAlign: 'center',
            fontFamily: Fonts.brandMedium,
          }}
        >
          Error loading recent deliveries.
        </Text>
      ) : isLoading ? (
        <RecentDeliverySkeleton count={3} />
      ) : // <Animated.FlatList
      //   data={recentDeliveries}
      //   renderItem={renderItem}
      //   keyExtractor={(item) => String(item.assignmentId)}
      //   ItemSeparatorComponent={() => (
      //     <View
      //       style={{
      //         height: scale(14),
      //       }}
      //     />
      //   )}
      //   ListEmptyComponent={renderEmptyComponent}
      //   scrollEventThrottle={16}
      //   showsVerticalScrollIndicator={false}
      //   onScroll={scrollHandler}

      //   onEndReached={() => {
      //     if (hasNextPage && !isFetchingNextPage) {
      //       fetchNextPage();
      //     }
      //   }}

      //   onEndReachedThreshold={0.5}

      //   ListFooterComponent={
      //     isFetchingNextPage ? (
      //       <Text
      //         style={{
      //           color: Colors.textMuted,
      //           textAlign: 'center',
      //           paddingVertical: scale(16),
      //           fontFamily: Fonts.brandMedium,
      //         }}
      //       >
      //         Loading more deliveries...
      //       </Text>
      //     ) : null
      //   }
      // />

      recentDeliveries.length > 0 ? (
        recentDeliveries.map((delivery) => (
          <RenderRecentDeliveries
            key={delivery.assignmentId}
            delivery={delivery}
            onPress={() => {
              setSelectedOrderId(delivery.orderId);
              setShowDetailsModal(true);
            }}
          />
        ))
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
      gap: scale(16),
    },

    title: {
      fontSize: normalize(16),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
    },
  });
