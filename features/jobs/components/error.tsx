import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
  const { Colors, isDark } = useTheme();

  const styles = createStyles(Colors);

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={[
        styles.container,
        { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#A7F3D0' : '#6EE7B7'}
          />
        ) : undefined
      }
    >
      <View
        style={[styles.iconWrapper, { backgroundColor: Colors.errorLight }]}
      >
        <Ionicons
          name="warning-outline"
          size={scale(36)}
          color={Colors.error}
        />
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            color: Colors.error,
            fontFamily: Fonts.brandMedium,
            fontSize: scale(16),
          }}
        >
          Failed to load jobs
        </Text>
        <Text
          style={{
            ...styles.loadingText,
            color: Colors.textMuted,
            fontFamily: Fonts.brandRegular,
          }}
        >
          {error?.message ?? `Failed to load jobs. Please try again.`}
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: scale(20),
      paddingVertical: scale(24),
      backgroundColor: Colors.background,
      gap: scale(16),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(8),
    },

    iconWrapper: {
      width: scale(72),
      height: scale(72),
      borderRadius: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: scale(16),
    },

    title: {
      fontSize: normalize(18),
      fontFamily: Fonts.brandSemiBold,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandRegular,
      textAlign: 'center',
    },

    loadingText: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandMedium,
      textAlign: 'center',
    },
  });
