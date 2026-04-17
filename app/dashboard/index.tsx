import Footer from '@/components/layout/footer';
import Button from '@/components/ui/buttons/button';
import { Colors, Fonts } from '@/constants/theme';
import AvailableDelivery from '@/features/dashboard/components/available-delivery';
import CompletedDeliveries from '@/features/dashboard/components/completed-deliveries';
import DeliveryDetails from '@/features/dashboard/components/delivery-details';
import Earnings from '@/features/dashboard/components/earnings';
import DashboardHeader from '@/features/dashboard/components/header';
import Performance from '@/features/dashboard/components/performance';
import StatCard from '@/features/dashboard/components/stat-card';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    'available' | 'completed' | 'performance' | 'earnings'
  >('available');

  return (
    <ScrollView>
      <View style={styles.container}>
        <DashboardHeader />

        <View style={styles.statsGrid}>
          <StatCard
            title="Today’s Earnings"
            value="NGN 42,500"
            icon="cash-outline"
          />

          <StatCard
            title="Deliveries"
            value="12"
            icon="bicycle-outline"
            iconBg={Colors.success}
            changeText="3 deliveries today"
          />

          <StatCard
            title="Care Rating"
            value="4.8"
            icon="star-outline"
            iconBg={Colors.text}
          />

          <StatCard
            title="Online Time"
            value="12h"
            icon="time-outline"
            iconBg={Colors.success}
            changeText="3 hours today"
          />
        </View>

        <DeliveryDetails />

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', gap: 24 },

  // GRID LAYOUT
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },

  tabContent: {
    gap: 24,
  },

  tabContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: Colors.inputBackground,
    padding: 4,
    marginVertical: 20,
    gap: 4,
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
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
