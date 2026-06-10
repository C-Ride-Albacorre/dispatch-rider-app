import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

export default function Earnings() {
  return (
    <View style={styles.earningsContainer}>
      <View style={styles.earningsDetails}>
        <View style={styles.earningsHeader}>
          <Text style={styles.earningsHeaderText}>Earnings Overview</Text>

          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>This Week</Text>
          </View>
        </View>

        <View style={styles.earningsDetails}>
          <View style={[    styles.earningItem, { backgroundColor: Colors.successExtraLight }]}>
            <View style={styles.earningDetail}>
              <Text style={styles.earningDetailText}>This Month</Text>

              <Text style={styles.earningDetailValue}>NGN 12,500</Text>
            </View>

            <Ionicons
              name="trending-up-outline"
              size={16}
              color={Colors.success}
            />
          </View>

          <View style={[    styles.earningItem, { backgroundColor: Colors.primaryLight }]}>
            <View style={styles.earningDetail}>
              <Text style={styles.earningDetailText}>This Week</Text>

              <Text style={styles.earningDetailValue}>NGN 42,500</Text>
            </View>

            <Ionicons
              name="trending-up-outline"
              size={16}
              color={Colors.success}
            />
          </View>

          <View style={[    styles.earningItem, { backgroundColor: Colors.light }]}>
            <View style={styles.earningDetail}>
              <Text style={styles.earningDetailText}>This Month</Text>

              <Text style={styles.earningDetailValue}>NGN 112,500</Text>
            </View>

            <Ionicons
              name="trending-up-outline"
              size={16}
              color={Colors.success}
            />
          </View>
        </View>
      </View>
      <View style={styles.earningsDetails}>
        <View style={styles.earningsHeader}>
          <Text style={styles.earningsHeaderText}>Earnings Overview</Text>

          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>This Week</Text>
          </View>
        </View>

        <View style={[  styles.earningItem, { backgroundColor: Colors.light }]}>
          <View style={styles.earningDetail}>
            <Ionicons name="cash-outline" size={16} color={Colors.primary} />
            <Text style={styles.earningDetailText}>Base Earnings</Text>
          </View>

          <Text style={styles.earningDetailValue}>NGN 12,500</Text>
        </View>

        <View style={[  styles.earningItem, { backgroundColor: Colors.light }]}>
          <View style={styles.earningDetail}>
            <Ionicons name="trophy-outline" size={16} color={Colors.primary} />
            <Text style={styles.earningDetailText}>Performance Bonus</Text>
          </View>

          <Text style={styles.earningDetailValue}>NGN 28,500</Text>
        </View>

        <View style={[  styles.earningItem, { backgroundColor: Colors.light }]}>
          <View style={styles.earningDetail}>
            <Ionicons name="cash-outline" size={16} color={Colors.primary} />
            <Text style={styles.earningDetailText}>Tips</Text>
          </View>

          <Text style={styles.earningDetailValue}>NGN 12,500</Text>
        </View>

        <View style={[  styles.earningItem, { backgroundColor: Colors.primaryLight  }]}>
          <View style={styles.earningDetail}>
            <Text style={styles.earningDetailText}>Total This Week</Text>
          </View>

          <Text style={styles.earningDetailValue}>₦285,400</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  earningsContainer: {
    gap: 32,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  earningsHeaderText: {
    fontSize: 16,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
  },

  filterText: {
    fontSize: 12,
    fontFamily: Fonts.brandMedium,
    color: Colors.textSecondary,
  },
earningsDetails:{

    gap: 12,

},
  earningItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    
  },

  earningDetail: {
    gap: 8,

  },

  earningDetailText: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },

    earningDetailValue: {

    fontSize: 14,
    fontFamily: Fonts.brandSemiBold,
    color: Colors.text,
    },


});
