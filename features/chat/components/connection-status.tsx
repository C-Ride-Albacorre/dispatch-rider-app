import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { StyleSheet, View } from 'react-native';

type Props = {
  isConnected: boolean;
};

/** Small live/connecting pill for the chat header */
export function ConnectionStatus({ isConnected }: Props) {
  const { Colors, isDark } = useTheme();

  const tint = isConnected ? Colors.success : Colors.warning;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isConnected
            ? Colors.successExtraLight
            : isDark
              ? Colors.warningLight
              : Colors.warning + '1A',
        },
      ]}
      accessibilityLabel={isConnected ? 'Connected' : 'Connecting'}
    >
      <View style={[styles.dot, { backgroundColor: tint }]} />
      <ThemedText
        style={styles.text}
        themeColor={isConnected ? 'success' : 'warning'}
      >
        {isConnected ? 'Connected' : 'Connecting…'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  text: {
    fontFamily: Fonts.brandMedium,
    fontSize: 12,
    lineHeight: 17,
  },
});
