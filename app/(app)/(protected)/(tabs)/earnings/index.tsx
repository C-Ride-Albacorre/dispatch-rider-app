import { HEADER_HEIGHT, useScrollHeader } from '@/components/layout/scroll-header-context';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EarningsScreen( ){
  

  // Mock array for cleaner payout listing history structure
  const payoutHistory = [
    { id: 'PO-001', date: '10 Jan', amount: '₦250,000', status: 'Completed' },
    { id: 'PO-002', date: '3 Jan', amount: '₦180,000', status: 'Completed' },
  ];


   const { Colors } = useTheme();
    const styles = createStyles(Colors);
  
      const insets = useSafeAreaInsets()
  
      const scrollHandler = useScrollHeader();

  return (
  <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
             contentContainerStyle={{ paddingTop: HEADER_HEIGHT + insets.top }}
          >

        <View style={styles.container}>
      {/* 1. Wallet Balance Hero Master Card */}
      <View style={[styles.walletHeroCard, { backgroundColor: '#1A202C' }]}>
        <View style={styles.walletHeaderHeader}>
          <Ionicons name="wallet-outline" size={scale(16)} color="#A0AEC0" />
          <Text style={styles.walletTitleLabel}>Wallet Balance</Text>
        </View>
        
        <Text style={[styles.mainBalanceText, { color: Colors.primary }]}>₦285,400</Text>
        
        <TouchableOpacity style={[styles.payoutButton, { backgroundColor: Colors.primary }]}>
          <Ionicons name="send-outline" size={scale(14)} color="#1A202C" />
          <Text style={styles.payoutButtonText}>Request Payout</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Horizontal Timeframe Filter Pill Toggles */}
      <View style={styles.timeframeFilterRow}>
        <TouchableOpacity style={styles.inactiveFilterFilter}>
          <Text style={styles.inactiveFilterText}>Today</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.activeFilterFilter}>
          <Text style={styles.activeFilterText}>Week</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.inactiveFilterFilter}>
          <Text style={styles.inactiveFilterText}>Month</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Performance Core Metric Grid Panels */}
      <View style={styles.metricsGridContainer}>
        <View style={styles.metricItemCard}>
          <Text style={styles.metricLabel}>Total Earnings</Text>
          <Text style={[styles.metricValue, { color: Colors.primary }]}>₦285,400</Text>
        </View>

        <View style={styles.metricItemCard}>
          <Text style={styles.metricLabel}>Deliveries</Text>
          <Text style={[styles.metricValue, { color: '#1A202C' }]}>87</Text>
        </View>

        <View style={styles.metricItemCard}>
          <Text style={styles.metricLabel}>Tips Earned</Text>
          <Text style={[styles.metricValue, { color: Colors.success }]}>₦12,400</Text>
        </View>

        <View style={styles.metricItemCard}>
          <Text style={styles.metricLabel}>Bonuses</Text>
          <Text style={[styles.metricValue, { color: '#3182CE' }]}>₦28,000</Text>
        </View>
      </View>

      {/* 4. Historic Payout Logs List Container */}
      <View style={styles.historyContainer}>
        <Text style={styles.sectionHeaderTitle}>Payout History</Text>
        
        {payoutHistory.map((payout) => (
          <View key={payout.id} style={styles.payoutRowCard}>
            <View style={styles.payoutLeftGroup}>
              <View style={[styles.bankIconFrame, { backgroundColor: Colors.success + '15' }]}>
                <Ionicons name="business-outline" size={scale(18)} color={Colors.success} />
              </View>
              <View>
                <Text style={styles.payoutTitle}>Bank Transfer</Text>
                <Text style={styles.payoutSubtext}>{payout.id} • {payout.date}</Text>
              </View>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.payoutAmountText, { color: Colors.success }]}>{payout.amount}</Text>
              <Text style={styles.payoutStatusTag}>{payout.status}</Text>
            </View>
          </View>
        ))}
      </View>
      </View>
  </Animated.ScrollView>
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
    walletHeroCard: {
      borderRadius: scale(20),
      padding: scale(20),
      marginBottom: scale(16),
      position: 'relative',
      overflow: 'hidden',
    },
    walletHeaderHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(6),
    },
    walletTitleLabel: {
      fontSize: normalize(13),
      color: '#A0AEC0',
      fontFamily: Fonts.brandMedium,
    },
    mainBalanceText: {
      fontSize: normalize(28),
      fontFamily: Fonts.brandSemiBold,
      marginVertical: scale(12),
    },
    payoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: scale(14),
      paddingVertical: scale(8),
      borderRadius: scale(10),
      gap: scale(6),
    },
    payoutButtonText: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandSemiBold,
      color: '#1A202C',
    },
    timeframeFilterRow: {
      flexDirection: 'row',
      backgroundColor: '#EDF2F7',
      borderRadius: scale(12),
      padding: scale(4),
      marginBottom: scale(16),
    },
    activeFilterFilter: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingVertical: scale(8),
      borderRadius: scale(8),
      alignItems: 'center',
      elevation: 1,
    },
    activeFilterText: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandSemiBold,
      color: '#1A202C',
    },
    inactiveFilterFilter: {
      flex: 1,
      paddingVertical: scale(8),
      alignItems: 'center',
    },
    inactiveFilterText: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandMedium,
      color: '#718096',
    },
    metricsGridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: scale(10),
      marginBottom: scale(20),
    },
    metricItemCard: {
      width: '48.5%', // Handles responsive 2-column spacing gracefully
      backgroundColor: '#FFFFFF',
      borderRadius: scale(14),
      padding: scale(14),
      borderWidth: 1,
      borderColor: '#EDF2F7',
    },
    metricLabel: {
      fontSize: normalize(12),
      color: '#718096',
      fontFamily: Fonts.brandRegular,
      marginBottom: scale(4),
    },
    metricValue: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
    },
    historyContainer: {
      gap: scale(10),
    },
    sectionHeaderTitle: {
      fontSize: normalize(15),
      fontFamily: Fonts.brandSemiBold,
      color: '#1A202C',
      marginBottom: scale(4),
    },
    payoutRowCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      padding: scale(14),
      borderRadius: scale(14),
      borderWidth: 1,
      borderColor: '#EDF2F7',
    },
    payoutLeftGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
    },
    bankIconFrame: {
      width: scale(38),
      height: scale(38),
      borderRadius: scale(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    payoutTitle: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandSemiBold,
      color: '#1A202C',
    },
    payoutSubtext: {
      fontSize: normalize(11),
      color: '#A0AEC0',
      fontFamily: Fonts.brandRegular,
      marginTop: scale(2),
    },
    payoutAmountText: {
      fontSize: normalize(13),
      fontFamily: Fonts.brandSemiBold,
    },
    payoutStatusTag: {
      fontSize: normalize(10),
      color: '#48BB78',
      fontFamily: Fonts.brandMedium,
      marginTop: scale(2),
    },
  });