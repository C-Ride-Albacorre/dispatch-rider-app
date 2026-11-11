import ScreenHeader from '@/components/layout/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

export default function NoActiveJob() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <ThemedView style={styles.flex}>
      <StatusBar style="auto" />
      <ScreenHeader title="Active" />

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="bicycle-outline" size={28} color={Colors.success} />
          </View>

          <View style={styles.text}>
            <ThemedText style={styles.title}>
              You currently have no active job
            </ThemedText>

            <ThemedText style={styles.message} themeColor="textMuted">
              Accept a new job to start delivering and earning.
            </ThemedText>
          </View>

          <Button
            variant="green"
            size="lg"
            style={styles.button}
            onPress={() => router.push('/(app)/(protected)/(tabs)/jobs')}
            leftIcon={
              <Ionicons
                name="chevron-back-outline"
                size={16}
                color={Colors.white}
              />
            }
          >
            Browse jobs
          </Button>
        </View>
      </View>
    </ThemedView>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: Spacing.three,
      paddingBottom: Spacing.six,
    },

    card: {
      alignItems: 'center',
      gap: Spacing.three,
      paddingVertical: Spacing.four,
      paddingHorizontal: Spacing.three,
    },

    iconCircle: {
   width: 64,
      height: 64,
borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.successExtraLight,
    },

    text: {
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

    button: {
      alignSelf: 'stretch',
    },
  });
