import { Colors, Fonts } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

export default function StatCard({
  title,
  value,
  icon,
  iconBg = Colors.primary,
  changeText = '+15%',
}: {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg?: string;
  changeText?: string;
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
    fontFamily: Fonts.brandSemiBold,
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
