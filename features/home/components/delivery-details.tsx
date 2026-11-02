import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, View } from 'react-native';

export default function DeliveryDetails() {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.inline}>
          <View style={styles.dot} />
          <ThemedText style={styles.cardTitle}>Active delivery</ThemedText>
        </View>

        <View style={styles.pill}>
          <ThemedText style={styles.pillText} themeColor="success">
            CRD-2024-1234
          </ThemedText>
        </View>
      </View>

      <View style={styles.route}>
        <View style={styles.routeRow}>
          <View style={styles.routeIcon}>
            <Ionicons name="navigate-outline" size={18} color={Colors.primary} />
          </View>
          <View style={styles.flex}>
            <ThemedText style={styles.label} themeColor="textMuted">
              Pickup
            </ThemedText>
            <ThemedText style={styles.body}>123 Main St, Lagos</ThemedText>
          </View>
        </View>

        <View style={styles.routeRow}>
          <View style={styles.routeIcon}>
            <Ionicons name="location-outline" size={18} color={Colors.primary} />
          </View>
          <View style={styles.flex}>
            <ThemedText style={styles.label} themeColor="textMuted">
              Dropoff
            </ThemedText>
            <ThemedText style={styles.body}>456 Elm St, Lagos</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.block}>
        <ThemedText style={styles.label} themeColor="textMuted">
          Customer
        </ThemedText>
        <View style={styles.row}>
          <View style={styles.flex}>
            <ThemedText style={styles.cardTitle}>John Doe</ThemedText>
            <ThemedText style={styles.secondary} themeColor="textSecondary">
              +234 800 123 4567
            </ThemedText>
          </View>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Ionicons name="call-outline" size={16} color={Colors.primary} />}
          >
            Call
          </Button>
        </View>
      </View>

      <View style={styles.block}>
        <ThemedText style={styles.label} themeColor="textMuted">
          Items
        </ThemedText>
        {[0, 1, 2].map((key) => (
          <View key={key} style={styles.item}>
            <Image source={require('@/assets/images/item.jpg')} style={styles.itemImage} />
            <ThemedText style={styles.body}>Burger x2</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.block}>
        <ThemedText style={styles.label} themeColor="textMuted">
          Earnings
        </ThemedText>
        <ThemedText style={styles.amount} themeColor="primary">
          ₦ 3,500
        </ThemedText>
      </View>

      <View style={styles.block}>
        <View style={styles.row}>
          <ThemedText style={styles.secondary} themeColor="textSecondary">
            Delivery progress
          </ThemedText>
          <ThemedText style={styles.secondary} themeColor="textSecondary">
            ETA 12mins
          </ThemedText>
        </View>

        <View style={styles.track}>
          <View style={styles.bar} />
        </View>

        <ThemedText style={styles.meta} themeColor="textMuted">
          5 mins to pickup
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <Button
          variant="green"
          size="sm"
          leftIcon={<Ionicons name="navigate-outline" size={16} color={Colors.white} />}
        >
          Navigate
        </Button>

        <Button
          size="sm"
          leftIcon={<Ionicons name="checkmark-outline" size={16} color={Colors.onPrimary} />}
        >
          Mark as delivered
        </Button>
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    card: {
      gap: Spacing.four,
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

    inline: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.success,
    },

    pill: {
      paddingHorizontal: Spacing.two,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: Colors.successExtraLight,
    },

    pillText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
    },

    cardTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    route: {
      gap: 12,
    },

    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    routeIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.primaryExtraLight,
    },

    block: {
      gap: Spacing.two,
    },

    label: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },

    body: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
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

    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    itemImage: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: Colors.backgroundTertiary,
    },

    amount: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
    },

    track: {
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.backgroundTertiary,
    },

    bar: {
      width: '60%',
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.primary,
    },

    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.two,
    },
  });
