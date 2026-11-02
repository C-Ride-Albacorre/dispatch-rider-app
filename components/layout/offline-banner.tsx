import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type OfflineBannerProps = {
  onRetry?: () => Promise<void> | void;
  isRetrying?: boolean;
};

export default function OfflineBanner({
  onRetry,
  isRetrying = false,
}: OfflineBannerProps) {
  const insets = useSafeAreaInsets();

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { paddingTop: insets.top + Spacing.two }]}
    >
      <View style={styles.banner}>
        <View style={styles.iconContainer}>
          <Ionicons name="cloud-offline-outline" size={18} color={Colors.error} />
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.title}>No internet connection</ThemedText>

          <ThemedText style={styles.message} themeColor="textMuted">
            Some features may be unavailable. We&apos;ll reconnect
            automatically.
          </ThemedText>
        </View>

        {onRetry && (
          <Button
            size="xs"
            variant="inverted"
            onPress={onRetry}
            disabled={isRetrying}
            loading={isRetrying}
          >
            Retry
          </Button>
        )}
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      elevation: 9999,
      paddingHorizontal: Spacing.three,
    },

    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },

    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.errorLight,
    },

    content: {
      flex: 1,
      gap: 2,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 14,
      lineHeight: 20,
    },

    message: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },
  });
