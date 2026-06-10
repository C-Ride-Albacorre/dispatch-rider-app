import { Colors } from '@/constants/theme';
import { normalize, scale } from '@/utils/scaling';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../ui/buttons/button';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerTitle}>Performance Incentive</Text>

      <Text style={styles.footerText}>
        Complete 10 more deliveries this week to unlock{' '}
        <Text style={styles.bonusText}>NGN15,000</Text> bonus!
      </Text>

      <View style={styles.incentiveProgress}>
        <View style={styles.incentiveHeader}>
          <View style={styles.incentiveInfo}>
            <Ionicons name="trophy-outline" size={24} color={Colors.primary} />
            <Text style={styles.incentiveProgressText}>
              Progress: 77/87 deliveries
            </Text>
          </View>

          <Text style={styles.incentiveProgressText}>88.5%</Text>
        </View>

        <View style={styles.incentiveProgressBar}>
          <View style={styles.incentiveProgressFill}></View>
        </View>
      </View>

      <Button>View Performance Details</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 44,
    backgroundColor: Colors.text,
    gap: 24,
    marginTop: 32,
  },

  footerTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: Colors.background,
  },

  footerText: {
    fontSize: normalize(16),
    color: Colors.background,
    lineHeight: normalize(28),
  },

  incentiveProgress: {
    gap: 24,
  },

  incentiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  incentiveInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  incentiveProgressText: {
    fontSize: normalize(14),
    color: Colors.background,
  },

  incentiveProgressBar: {
    height: scale(10),
    backgroundColor: Colors.inputBackground,
    borderRadius: scale(5),
    overflow: 'hidden',
  },

  incentiveProgressFill: {
    height: '100%',
    width: '88.5%',
    backgroundColor: Colors.primary,
    borderRadius: scale(5),
  },

  bonusText: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
