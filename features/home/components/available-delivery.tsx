import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, View } from 'react-native';

export default function AvailableDelivery() {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badges}>
          <View style={[styles.pill, { backgroundColor: Colors.successExtraLight }]}>
            <ThemedText style={styles.pillText} themeColor="success">
              CR-2847
            </ThemedText>
          </View>

          <View style={[styles.pill, { backgroundColor: Colors.errorLight }]}>
            <ThemedText style={styles.pillText} themeColor="error">
              Express
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.amount}>₦ 4500</ThemedText>
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

      <View style={styles.details}>
        <Detail icon="bicycle-outline" label="Distance" value="5.2 km" />
        <Detail icon="cube-outline" label="Items" value="2 Items" />
        <Detail icon="time-outline" label="Time slot" value="10:00 AM - 12:00 PM" />
      </View>

      <View style={styles.items}>
        <ThemedText style={styles.label} themeColor="textMuted">
          Items
        </ThemedText>
        {[0, 1, 2].map((key) => (
          <View key={key} style={styles.item}>
            <Image
              source={require('@/assets/images/item.jpg')}
              style={styles.itemImage}
            />
            <ThemedText style={styles.body}>Burger x2</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <View style={styles.actionRow}>
          <Button
            leftIcon={
              <Ionicons
                name="checkmark-done-outline"
                size={16}
                color={Colors.white}
              />
            }
            variant="green"
            size="sm"
          >
            Accept delivery
          </Button>

          <Button
            leftIcon={
              <Ionicons name="close-outline" size={16} color={Colors.error} />
            }
            variant="redOutline"
            size="sm"
          >
            Decline
          </Button>
        </View>

        <Button
          size="sm"
          leftIcon={
            <Ionicons name="eye-outline" size={16} color={Colors.onPrimary} />
          }
        >
          View details
        </Button>
      </View>
    </View>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={16} color={Colors.textMuted} />
      <ThemedText style={[styles.secondary, styles.flex]} themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText style={styles.detailValue}>{value}</ThemedText>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    flex: {
      flex: 1,
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

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    badges: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.one,
    },

    pill: {
      paddingHorizontal: Spacing.two,
      paddingVertical: 2,
      borderRadius: 999,
    },

    pillText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
    },

    amount: {
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

    details: {
      gap: Spacing.two,
      paddingTop: Spacing.three,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
    },

    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
    },

    detailValue: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
    },

    items: {
      gap: Spacing.two,
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

    actions: {
      gap: Spacing.two,
    },

    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.two,
    },
  });
