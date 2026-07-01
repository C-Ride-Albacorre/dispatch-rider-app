import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NoActiveJob() {
  const { Colors, isDark } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <View style={{ gap: scale(12), alignItems: 'center', width: '100%' }}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: Colors.successExtraLight,
            },
          ]}
        >
          <Ionicons
            name="bicycle-outline"
            size={scale(36)}
            color={Colors.success}
          />
        </View>

        <View style={{ gap: scale(8), marginBottom: scale(16) }}>
          <Text style={styles.title}>You currently have no active job</Text>

          <Text style={styles.subtitle}>
            Accept a new job to start delivering and earning.
          </Text>
        </View>

        <Button
          variant="green"
          style={{
            width: '100%',
          }}
          onPress={() => router.push('/(app)/(protected)/(tabs)/jobs')}
          // onPress={() => {
          //   router.push('/active-order');
          // }}
          leftIcon={
            <Ionicons
              name="search-outline"
              size={16}
              color={isDark ? Colors.text : Colors.background}
            />
          }
        >
          Search for Delivery
        </Button>
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: scale(16),
      paddingVertical: scale(12),
      gap: scale(12),
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
      color: Colors.textMuted,
    },

    iconWrapper: {
      width: scale(72),
      height: scale(72),
      borderRadius: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: scale(16),
    },
  });
