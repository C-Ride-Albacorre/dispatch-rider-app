import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import Button from '../ui/buttons/button';

export default function Footer() {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.footer}>
      <View style={styles.text}>
        <ThemedText style={styles.title}>Performance incentive</ThemedText>

        <ThemedText style={styles.body} themeColor="textSecondary">
          Complete 10 more deliveries this week to unlock{' '}
          <ThemedText style={styles.bonus} themeColor="primary">
            NGN15,000
          </ThemedText>{' '}
          bonus!
        </ThemedText>
      </View>

      <View style={styles.progress}>
        <View style={styles.progressHeader}>
          <View style={styles.inline}>
            <Ionicons name="trophy-outline" size={18} color={Colors.primary} />
            <ThemedText style={styles.secondary} themeColor="textSecondary">
              Progress: 77/87 deliveries
            </ThemedText>
          </View>

          <ThemedText style={styles.value}>88.5%</ThemedText>
        </View>

        <View style={styles.track}>
          <View style={styles.fill} />
        </View>
      </View>

      <Button>View performance details</Button>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    footer: {
      gap: Spacing.four,
      padding: Spacing.four,
      marginTop: Spacing.five,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
    },

    text: {
      gap: Spacing.two,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
    },

    body: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
    },

    bonus: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
    },

    progress: {
      gap: 12,
    },

    progressHeader: {
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

    secondary: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    value: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
    },

    track: {
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
      backgroundColor: Colors.backgroundTertiary,
    },

    fill: {
      height: '100%',
      width: '88.5%',
      borderRadius: 3,
      backgroundColor: Colors.primary,
    },
  });
