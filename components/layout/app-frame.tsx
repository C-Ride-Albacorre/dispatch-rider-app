import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AppFrameProps = {
  header?: React.ReactNode;
  badge?: string;
  badgeMuted?: boolean;
  headline: React.ReactNode;
  children?: React.ReactNode;
};

export default function AppFrame({ header, badge, badgeMuted, headline, children }: AppFrameProps) {
  const { Colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(Colors);

  return (
    <LinearGradient
      colors={isDark ? [Colors.backgroundElement, Colors.background] : [Colors.text, Colors.black]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.frame, { paddingTop: insets.top + Spacing.two }]}
    >
      <View style={styles.glow} />
      <View style={styles.glowSmall} />

      {header}

      {!!badge && (
        <View style={styles.badge}>
          <View
            style={[styles.badgeDot, { backgroundColor: badgeMuted ? Colors.textMuted : Colors.primary }]}
          />
          <ThemedText style={styles.badgeText} themeColor={badgeMuted ? 'textMuted' : 'primary'}>
            {badge}
          </ThemedText>
        </View>
      )}

      <ThemedText style={styles.headline} themeColor="white">
        {headline}
      </ThemedText>

      {children}
    </LinearGradient>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    frame: {
      paddingHorizontal: Spacing.three,
      paddingBottom: Spacing.four,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      overflow: 'hidden',
    },

    glow: {
      position: 'absolute',
      width: 260,
      height: 260,
      borderRadius: 999,
      backgroundColor: Colors.primaryExtraLight,
      top: -90,
      right: -90,
    },

    glowSmall: {
      position: 'absolute',
      width: 140,
      height: 140,
      borderRadius: 999,
      backgroundColor: Colors.glass,
      bottom: -70,
      left: -40,
    },

    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: Spacing.two,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: Colors.glass,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.glassBorder,
      marginTop: Spacing.four,
      marginBottom: Spacing.three,
    },

    badgeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },

    badgeText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },

    headline: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 28,
      lineHeight: 36,
      letterSpacing: -0.4,
      marginBottom: Spacing.four,
    },
  });
