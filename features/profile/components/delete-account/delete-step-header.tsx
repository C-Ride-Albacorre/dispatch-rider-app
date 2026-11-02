import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function DeleteStepHeader({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={28} color={Colors.error} />
      </View>

      <ThemedText style={styles.title}>{title}</ThemedText>

      <ThemedText style={styles.description} themeColor="textSecondary">
        {description}
      </ThemedText>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      width: '100%',
    },

    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: Colors.errorLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.three,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
      marginBottom: Spacing.two,
      textAlign: 'center',
    },

    description: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      marginBottom: Spacing.four,
    },
  });
