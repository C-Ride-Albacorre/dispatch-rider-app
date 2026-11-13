import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

type VendorCodeCardProps = {
  code: string;
  size?: 'large' | 'compact';
  hint?: string;
};

export default function VendorCodeCard({
  code,
  size = 'large',
  hint = 'Show this code to the vendor to pick up the order',
}: VendorCodeCardProps) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);
  const digits = code.split('');
  const compact = size === 'compact' || digits.length > 5;

  return (
    <View
      style={[styles.card, compact && styles.cardCompact]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Pickup code ${digits.join(' ')}. ${hint}`}
    >
      <View style={styles.labelRow}>
        <View style={styles.iconBadge}>
          <Ionicons name="key" size={12} color={Colors.onPrimary} />
        </View>
        <ThemedText style={styles.label}>Pickup code</ThemedText>
      </View>

      <View style={styles.digits}>
        {digits.map((digit, index) => (
          <View
            key={`${digit}-${index}`}
            style={[styles.digitBox, compact && styles.digitBoxCompact]}
          >
            <ThemedText
              style={[styles.digit, compact && styles.digitCompact]}
              selectable
            >
              {digit}
            </ThemedText>
          </View>
        ))}
      </View>

      {!!hint && (
        <ThemedText
          style={[styles.hint, compact && styles.hintCompact]}
          themeColor="textSecondary"
        >
          {hint}
        </ThemedText>
      )}
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    card: {
      alignItems: 'center',
      gap: 12,
      paddingVertical: Spacing.three,
      paddingHorizontal: 14,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: Colors.primary,
      backgroundColor: Colors.primaryExtraLight,
    },

    cardCompact: {
      gap: Spacing.two,
      paddingVertical: 12,
      borderRadius: 14,
    },

    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    iconBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primary,
    },

    label: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 12,
      lineHeight: 16,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    },

    digits: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: Spacing.two,
    },

    digitBox: {
      width: 56,
      height: 68,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: Colors.primaryLight,
      backgroundColor: Colors.card,
    },

    digitBoxCompact: {
      width: 44,
      height: 52,
      borderRadius: 12,
    },

    digit: {
      fontFamily: Fonts.brandBold,
      fontSize: 34,
      lineHeight: 42,
      includeFontPadding: false,
    },

    digitCompact: {
      fontSize: 26,
      lineHeight: 32,
    },

    hint: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
    },

    hintCompact: {
      fontSize: 12,
      lineHeight: 17,
    },
  });
