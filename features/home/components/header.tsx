import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useUpdateDriverStatus } from '../use-fetch';

/** Online/offline switch on the Home hero */
export default function HomeHeader({
  driverStatus,
}: {
  driverStatus: 'ONLINE' | 'OFFLINE' | 'BUSY';
}) {
  const [isEnabled, setIsEnabled] = useState<boolean>(
    driverStatus === 'ONLINE',
  );

  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const { mutate, isPending } = useUpdateDriverStatus();

  const isBusy = driverStatus === 'BUSY';

  useEffect(() => {
    setIsEnabled(driverStatus === 'ONLINE');
  }, [driverStatus]);

  const toggleSwitch = () => {
    if (isBusy) return;

    const newStatus = !isEnabled;

    setIsEnabled(newStatus);

    mutate(newStatus ? 'ONLINE' : 'OFFLINE', {
      onSuccess: () => {
        Toast.show({
          type: `${newStatus ? 'success' : 'info'}`,
          text1: `You are now ${newStatus ? 'online' : 'offline'}`,
          text1Style: { fontFamily: Fonts.brandMedium },
        });
      },
      onError: () => {
        setIsEnabled(!newStatus);
      },
    });
  };

  const title = isBusy
    ? 'On a delivery'
    : isEnabled
      ? 'You’re online'
      : 'You’re offline';

  const subtitle = isBusy
    ? 'Finish this delivery to change your status'
    : isEnabled
      ? 'New job requests will come to you'
      : 'Go online to start getting jobs';

  return (
    <View style={styles.card}>
      <View style={styles.flex}>
        <ThemedText style={styles.title} themeColor="white">
          {title}
        </ThemedText>
        <ThemedText style={styles.subtitle} themeColor="textMuted">
          {subtitle}
        </ThemedText>
      </View>

      {isPending ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : (
        <Switch
          disabled={isBusy || isPending}
          trackColor={{ false: Colors.glassBorder, true: Colors.success }}
          thumbColor={isBusy ? Colors.warning : Colors.white}
          ios_backgroundColor={Colors.glassBorder}
          onValueChange={toggleSwitch}
          value={isEnabled}
          accessibilityLabel="Online status"
          style={isBusy && styles.disabled}
        />
      )}
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
      padding: 14,
      marginBottom: Spacing.two,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.glassBorder,
      backgroundColor: Colors.glass,
    },

    flex: {
      flex: 1,
      gap: 2,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 15,
      lineHeight: 20,
    },

    subtitle: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
    },

    disabled: {
      opacity: 0.5,
    },
  });
