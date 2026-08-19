import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Text, View } from 'react-native';

export default function ErrorMessage({ message }: { message: string }) {
  const { Colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: Colors.errorLight,
        padding: scale(10),
        borderRadius: scale(5),
        marginBottom: scale(10),
      }}
      role="alert"
    >
      <Text
        style={{
          color: Colors.error,
          fontFamily: Fonts.brandMedium,
          fontSize: normalize(12),
        }}
      >
        {message}
      </Text>
    </View>
  );
}
