import Footer from '@/components/layout/footer';
import {
  HEADER_HEIGHT,
  useScrollHeader,
} from '@/components/layout/scroll-header-context';
import { Fonts } from '@/constants/theme';
import AvailableDelivery from '@/features/home/components/available-delivery';
import CompletedDeliveries from '@/features/home/components/completed-deliveries';
import Earnings from '@/features/home/components/earnings';
import HomeHeader from '@/features/home/components/header';
import NoDelivery from '@/features/home/components/no-delivery';
import Performance from '@/features/home/components/performance';
import StatFrame from '@/features/home/components/stat-frame';
import { useDashboardStats } from '@/features/home/use-fetch';
import { useTheme } from '@/hooks/use-theme';
import { scale } from '@/utils/scaling';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';

export default function Dashboard() {
  const { data, isLoading } = useDashboardStats();

  const stats = data?.stats;

  const driverInfo = data?.personalInfo;

  const driverStatus = stats?.status ?? 'OFFLINE';

  const [activeTab, setActiveTab] = useState<
    'available' | 'completed' | 'performance' | 'earnings'
  >('available');

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const scrollHandler = useScrollHeader();

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
    >
      <View style={styles.container}>
        <HomeHeader driverStatus={driverStatus} driverInfo={driverInfo} />

        <StatFrame stats={stats} isLoading={isLoading} />

        <NoDelivery />

        {/* <DeliveryDetails /> */}

        <View style={styles.tabContent}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'available' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('available')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'available' && styles.activeTabText,
                ]}
              >
                Available
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'completed' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('completed')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'completed' && styles.activeTabText,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'performance' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('performance')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'performance' && styles.activeTabText,
                ]}
              >
                Performance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'earnings' && styles.activeTab]}
              onPress={() => setActiveTab('earnings')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'earnings' && styles.activeTabText,
                ]}
              >
                Earnings
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'available' && <AvailableDelivery />}

          {activeTab === 'completed' && <CompletedDeliveries />}

          {activeTab === 'performance' && <Performance />}

          {activeTab === 'earnings' && <Earnings />}
        </View>
      </View>

      <Footer />
    </Animated.ScrollView>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: scale(20),
      backgroundColor: Colors.background,
      gap: scale(24),
    },

    tabContent: {
      gap: scale(24),
    },

    tabContainer: {
      flexDirection: 'row',
      borderRadius: scale(14),
      backgroundColor: Colors.inputBackground,
      padding: scale(4),
      marginVertical: scale(20),
      gap: scale(4),
    },

    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scale(8),
      borderRadius: scale(10),
      gap: scale(6),
    },

    activeTab: {
      backgroundColor: '#fff',
      color: Colors.text,
    },
    tabText: {
      fontSize: 14,
      fontFamily: Fonts.brandMedium,
      color: Colors.textSecondary,
    },

    activeTabText: {
      color: Colors.text,
    },
  });
