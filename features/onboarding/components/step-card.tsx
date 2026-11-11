import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

type StepCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function StepCard({ icon, title, subtitle, children }: StepCardProps) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconTile}>
          <Ionicons name={icon} size={20} color={Colors.primary} />
        </View>

        <View style={styles.headerText}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.subtitle} themeColor="textMuted">
            {subtitle}
          </ThemedText>
        </View>
      </View>

      {children}
    </View>
  );
}

export function StepActions({ children }: { children: React.ReactNode }) {
  return <View style={stepActionStyles.row}>{children}</View>;
}

export const stepActionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },

  button: {
    flex: 1,
  },
});

const createStyles = (Colors: any) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: Colors.card,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 16,
      padding: Spacing.three,
      gap: Spacing.four,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    iconTile: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: Colors.primaryExtraLight,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerText: {
      flex: 1,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
    },

    subtitle: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },
  });
