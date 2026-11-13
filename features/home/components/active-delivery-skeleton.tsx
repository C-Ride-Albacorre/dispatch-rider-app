import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { StyleSheet, View } from 'react-native';

import { Block } from './recent-delivery-skeleton';

/**
 * Placeholder matching the layout of <ActiveDelivery /> while the
 * driver's current order is still being fetched.
 */
export default function ActiveDeliverySkeleton() {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View
      style={styles.container}
      accessibilityLabel="Loading active delivery"
      accessibilityRole="progressbar"
    >
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerText}>
          <Block width={140} height={18} />
          <Block width={180} height={12} />
        </View>
        <Block width={110} height={20} radius={999} />
      </View>

      <View style={styles.card}>
        {/* Store summary */}
        <View style={styles.row}>
          <Block width={44} height={44} radius={12} />
          <View style={styles.flexText}>
            <Block width="60%" height={15} />
            <Block width="40%" height={12} />
          </View>
          <Block width={64} height={16} />
        </View>

        {/* Progress stepper */}
        <View style={styles.stepper}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.step}>
              <Block height={4} radius={2} />
              <Block width="60%" height={10} />
            </View>
          ))}
        </View>

        {/* Next stop */}
        <View style={[styles.row, styles.nextStop]}>
          <Block width={36} height={36} radius={10} />
          <View style={styles.flexText}>
            <Block width="35%" height={10} />
            <Block width="55%" height={14} />
            <Block width="75%" height={12} />
          </View>
          <Block width={44} height={28} />
        </View>

        {/* CTA */}
        <Block height={44} radius={12} />
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      gap: Spacing.three,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: Spacing.two,
    },

    headerText: {
      gap: 6,
    },

    card: {
      gap: Spacing.three,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    flexText: {
      flex: 1,
      gap: 6,
    },

    stepper: {
      flexDirection: 'row',
      gap: Spacing.two,
    },

    step: {
      flex: 1,
      gap: 6,
    },

    nextStop: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: Colors.backgroundSecondary,
    },
  });
