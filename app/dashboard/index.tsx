import { Colors, Fonts } from '@/constants/theme';
import DashboardHeader from '@/features/dashboard/components/header';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

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

function StatCard({
  title,
  value,
  icon,
  iconBg = Colors.primary,
  changeText = '+15%',
}) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statHeader}>
        <Text style={styles.statTitle}>{title}</Text>

        <View style={[styles.statIcon, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={16} color={Colors.background} />
        </View>
      </View>

      <Text style={styles.statValue}>{value}</Text>

      <View style={styles.statChange}>
        <Ionicons name="trending-up-outline" size={14} color={Colors.success} />
        <Text style={styles.statChangeText}>{changeText}</Text>
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

  // CARD
  statItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 12,

    borderWidth: 1,
    borderColor: Colors.border,

    // shadow (iOS + Android)
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // HEADER
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statTitle: {
    fontSize: 13,
    fontFamily: Fonts.brandRegular,
    color: '#666',
  },

  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // VALUE
  statValue: {
    fontSize: 22,
    fontFamily: Fonts.brandBold,
    color: Colors.text,
  },

  // CHANGE ROW
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statChangeText: {
    fontSize: 12,
    fontFamily: Fonts.brandRegular,
    color: Colors.success,
  },
});
