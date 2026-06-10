import Avatar from '@/components/ui/avatar';
import { Colors, Fonts } from '@/constants/theme';
import { normalize, scale } from '@/utils/scaling';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useUpdateDriverStatus } from '../use-fetch';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/hooks/use-theme';

export default function HomeHeader({
  driverInfo,
  driverStatus,
}: {
  driverInfo?: {
    profileImage?: string | null;
    firstName?: string;
    lastName?: string;
  };
  driverStatus: 'ONLINE' | 'OFFLINE';
}) {
  const [isEnabled, setIsEnabled] = useState<boolean>(
    driverStatus === 'ONLINE' ? true : false,
  );


  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const { mutate, isPending } = useUpdateDriverStatus();

  useEffect(() => {
    setIsEnabled(driverStatus === 'ONLINE');
  }, [driverStatus]);

  const toggleSwitch = () => {
    const newStatus = !isEnabled;

    // optimistic update
    setIsEnabled(newStatus);

    mutate(newStatus ? 'ONLINE' : 'OFFLINE', {
      onSuccess: () => {
        // success toast or feedback can be added here
        Toast.show({
          type: `${newStatus ? 'success' : 'info'}`,
          text1: `You are now ${newStatus ? 'ONLINE' : 'OFFLINE'}`,
        });
      },
      onError: () => {
        // rollback if request fails
        setIsEnabled(!newStatus);
      },
    });
  };

  const driverName =
    `${driverInfo?.firstName ?? ''} ${driverInfo?.lastName ?? ''}`.trim();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greetings}>
          Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}
        </Text>

        <View style={styles.driverName}>
          <Text style={styles.title}>{driverName}</Text>{' '}
          <Text style={styles.emoji}>👋</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isEnabled ? 'Online' : 'Offline'}
        </Text>

        {isPending ? (
          <ActivityIndicator size="small" color={Colors.success} />
        ) : (
          <Switch
            trackColor={{
              false: Colors.light,
              true: Colors.success,
            }}
            thumbColor={isEnabled ? Colors.background : Colors.light}
            ios_backgroundColor={Colors.light}
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={{
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
            }}
          />
        )}
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: scale(12),
    },

    header: {
      flexDirection: 'column',
      gap: scale(4),
    },

    greetings: {
      fontSize: normalize(12),
      color: Colors.textSecondary,
      fontFamily: Fonts.brandMedium,
    },

    driverName: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(2),
    },

    emoji: {
      fontSize: normalize(16),
    },

    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },

    statusText: {
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,
      color: Colors.textSecondary,
      marginRight: scale(4),
    },

    title: { fontFamily: Fonts.brandSemiBold, fontSize: normalize(16) , color: Colors.text},
    message: { color: Colors.textSecondary, marginBottom: scale(20) },
  });
