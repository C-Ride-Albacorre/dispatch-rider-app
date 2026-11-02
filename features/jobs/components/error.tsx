import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

type ErrorContentProps = {
  error?: Error;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export default function ErrorContent({
  error,
  refreshing = false,
  onRefresh,
}: ErrorContentProps) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.textMuted}
          />
        ) : undefined
      }
    >
      <View style={styles.iconWrapper}>
        <Ionicons name="warning-outline" size={28} color={Colors.error} />
      </View>

      <View style={styles.textGroup}>
        <ThemedText style={styles.title}>Failed to load jobs</ThemedText>
        <ThemedText style={styles.message} themeColor="textMuted">
          {error?.message ?? 'Failed to load jobs. Please try again.'}
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.three,
      paddingHorizontal: Spacing.four,
      paddingVertical: Spacing.five,
    },

    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 999,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.errorLight,
    },

    textGroup: {
      alignItems: 'center',
      gap: Spacing.one,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 16,
      lineHeight: 22,
      textAlign: 'center',
    },

    message: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
    },
  });
