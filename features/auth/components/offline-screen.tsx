import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Fonts } from '@/constants/theme';
import Button from '@/components/ui/buttons/button';
import { normalize, scale } from '@/utils/scaling';
import { useState } from 'react';

type Props = {
  onRetry?: () => void;
};

export default function OfflineScreen({ onRetry }: Props) {
  const { Colors } = useTheme();

  const [loading, setLoading] = useState(false);

  const styles = createStyles(Colors);

  async function handleRetry() {
    if (!onRetry) return;

    try {
      setLoading(true);
      await onRetry();
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('@/assets/images/offline.png')}
          style={{ width: 150, height: 150 }}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>You're Offline</Text>

      {/* Description */}
      <Text style={styles.description}>
        We can't connect to the internet right now. Check your connection to
        continue receiving deliveries and route updates.
      </Text>

      {/* <Button style={styles.btn} onPress={handleRetry} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : 'Try Again'}
      </Button> */}

      <Text style={styles.footer}>Last checked: Just now</Text>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scale(24),
    },

    illustrationContainer: {
      alignItems: 'center',
      marginBottom: scale(30),
    },

    btn: {
      width: '100%',
      justifyContent: 'center',
    },

    title: {
      fontSize: normalize(24),
      fontFamily: Fonts.brandBold,
      color: Colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },

    description: {
      fontFamily: Fonts.brandRegular,
      lineHeight: scale(23),
      color: Colors.textMuted,
      textAlign: 'center',
      marginBottom: scale(30),
    },

    footer: {
      marginTop: scale(20),
      fontFamily: Fonts.brandRegular,
      fontSize: normalize(12),
      color: Colors.textMuted,
    },
  });
