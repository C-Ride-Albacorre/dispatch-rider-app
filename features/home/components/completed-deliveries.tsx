import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

export default function CompletedDeliveries() {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.flex}>
          <ThemedText style={styles.sectionTitle}>
            Today&apos;s completed deliveries
          </ThemedText>
          <ThemedText style={styles.sectionSubtitle} themeColor="textMuted">
            What you&apos;ve dropped off so far
          </ThemedText>
        </View>

        <View style={[styles.pill, { backgroundColor: Colors.backgroundTertiary }]}>
          <ThemedText style={styles.pillText} themeColor="textSecondary">
            This week
          </ThemedText>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.badges}>
            <View style={[styles.pill, { backgroundColor: Colors.primaryExtraLight }]}>
              <ThemedText style={styles.pillText} themeColor="primary">
                CR-2847
              </ThemedText>
            </View>
            <View style={[styles.pill, { backgroundColor: Colors.successExtraLight }]}>
              <Ionicons
                name="checkmark-done-outline"
                size={12}
                color={Colors.success}
              />
              <ThemedText style={styles.pillText} themeColor="success">
                Delivered
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.meta} themeColor="textMuted">
            18 mins ago
          </ThemedText>
        </View>

        <View style={styles.customer}>
          <ThemedText style={styles.label} themeColor="textMuted">
            Customer
          </ThemedText>
          <ThemedText style={styles.cardTitle}>Funke Adeleke</ThemedText>
          <ThemedText style={styles.secondary} themeColor="textSecondary">
            funkeakindele@gmail.com
          </ThemedText>
          <ThemedText style={styles.secondary} themeColor="textSecondary">
            08012345678
          </ThemedText>
        </View>

        <View style={[styles.row, styles.footer]}>
          <ThemedText style={styles.amount}>₦ 6500</ThemedText>

          <View style={styles.badges}>
            <View style={styles.stat}>
              <Ionicons name="cash-outline" size={16} color={Colors.success} />
              <ThemedText style={styles.secondary} themeColor="success">
                ₦1,000 tip
              </ThemedText>
            </View>

            <View style={styles.stat}>
              <Ionicons name="star" size={16} color={Colors.primary} />
              <ThemedText style={styles.secondary}>5.0</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    container: {
      gap: Spacing.three,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: Spacing.two,
    },

    sectionTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
    },

    sectionSubtitle: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 18,
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
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.two,
    },

    badges: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
      paddingHorizontal: Spacing.two,
      paddingVertical: 2,
      borderRadius: 999,
    },

    pillText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
    },

    customer: {
      gap: 2,
    },

    label: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: Spacing.one,
    },

    cardTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    secondary: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    meta: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    footer: {
      paddingTop: Spacing.three,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
    },

    amount: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    stat: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
    },
  });
