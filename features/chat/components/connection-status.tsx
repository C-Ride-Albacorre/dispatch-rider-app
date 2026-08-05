import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  isConnected: boolean;
};

export function ConnectionStatus({ isConnected }: Props) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isConnected
            ? 'rgba(34, 197, 94, 0.1)'
            : 'rgba(239, 68, 68, 0.1)',
        },
      ]}
    >
      <Ionicons
        name={isConnected ? 'checkmark-circle' : 'alert-circle'}
        size={16}
        color={isConnected ? Colors.success : Colors.error}
      />
      <Text
        style={[
          styles.text,
          {
            color: isConnected ? Colors.success : Colors.error,
          },
        ]}
      >
        {isConnected ? 'Connected' : 'Connecting...'}
      </Text>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: scale(6),
      paddingVertical: scale(6),
      paddingHorizontal: scale(12),
      borderRadius: 6,
    },
    text: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
    },
  });
