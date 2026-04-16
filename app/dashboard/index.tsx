import { Colors } from '@/constants/theme';
import DashboardHeader from '@/features/dashboard/components/header';
import StatCard from '@/features/dashboard/components/stat-card';
import { StyleSheet,  View } from 'react-native';

export default function Dashboard() {
  return (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    gap: 20,
  },

  // GRID LAYOUT
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
});
