import { ThemedText } from '@/components/themed-text';
import IconButton from '@/components/ui/buttons/icon-button';
import { Fonts, Spacing } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  /** Shows a back button */
  onBack?: () => void;
  right?: React.ReactNode;
};

/** Title bar for full screens, padded below the status bar */
export default function ScreenHeader({ title, subtitle, onBack, right }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
      {onBack && (
        <IconButton icon="chevron-back" size="md" onPress={onBack} accessibilityLabel="Go back" />
      )}
      <View style={styles.body}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>
        {!!subtitle && (
          <ThemedText style={styles.subtitle} themeColor="textMuted" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },

  body: {
    flex: 1,
  },

  title: {
    fontFamily: Fonts.brandSemiBold,
    fontSize: 22,
    lineHeight: 28,
  },

  subtitle: {
    fontFamily: Fonts.brandRegular,
    fontSize: 13,
    lineHeight: 18,
  },
});
