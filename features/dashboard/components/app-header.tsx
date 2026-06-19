import AppModal from '@/components/layout/app-modal';
import Avatar from '@/components/ui/avatar';
import IconButton from '@/components/ui/buttons/icon-button';
import { Fonts } from '@/constants/theme';
import { useDashboardStats } from '@/features/home/use-fetch';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AppHeader() {
  const { Colors } = useTheme();
  const styles = createHeaderStyles(Colors);
  // const [driverStatus, setDriverStatus] = useState<'ONLINE' | 'OFFLINE'>(
  //   'OFFLINE',
  // );
  const { data, isPending } = useDashboardStats();

  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(' AppHeader render: ', { data, isPending });

  const driverInfo = data?.personalInfo;

  const status = data?.stats?.status ?? 'OFFLINE';

  // useEffect(() => {
  //   setDriverStatus(status);
  // }, [status]);

  const driverStatus = data?.stats?.status ?? 'OFFLINE';

  const driverName =
    `${driverInfo?.firstName ?? ''} ${driverInfo?.lastName ?? ''}`.trim();

  return (
    <View style={styles.container}>
      {/* Left — Logo */}
      <Image
        source={require('@/assets/images/c-ride.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Right — status + notification + avatar */}
      <View style={styles.right}>
        {/* Online/Offline toggle */}
        <View
          style={[
            styles.statusRow,
            {
              backgroundColor:
                driverStatus === 'ONLINE'
                  ? Colors.successExtraLight
                  : Colors.backgroundTertiary,
              borderColor:
                driverStatus === 'ONLINE'
                  ? Colors.success
                  : Colors.backgroundSecondary,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  driverStatus === 'ONLINE'
                    ? Colors.success
                    : Colors.textSecondary,
              },
            ]}
          />

          <Text
            style={[
              styles.statusText,
              {
                color:
                  driverStatus === 'ONLINE'
                    ? Colors.success
                    : Colors.textSecondary,
              },
            ]}
          >
            {isPending ? (
              <ActivityIndicator size={12} color={Colors.success} />
            ) : driverStatus === 'ONLINE' ? (
              'Online'
            ) : (
              'Offline'
            )}
          </Text>
        </View>

        {/* Notification bell */}
        <IconButton
          variant="outline"
          notificationCount={3}
          size="md"
          onPress={() => setIsModalOpen(true)}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={Colors.textSecondary}
          />
        </IconButton>

        {/* Avatar */}
        <Avatar
          name={driverInfo?.profileImage ? driverInfo.profileImage : driverName}
          size={36}
        />
      </View>

      <AppModal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <View style={styles.alertBox}>
          <View style={styles.header}>
            {/* This is your notification dot */}
            <View style={styles.dot} />
            <Text style={styles.title}>Update Available</Text>
          </View>
          <Text style={styles.message}>A new version of the app is ready.</Text>
          <TouchableOpacity
            onPress={() => setIsModalOpen(false)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </AppModal>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const createHeaderStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scale(20),
      paddingVertical: scale(10),
      backgroundColor: Colors.background,
      borderBottomWidth: 1,
      borderBottomColor: Colors.inputBackground,
    },
    logo: {
      width: scale(60),
      height: scale(30),
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
    },
    statusRow: {
      paddingHorizontal: scale(8),
      paddingVertical: scale(4),
      borderRadius: scale(20),

      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(6),
    },

    statusDot: {
      borderRadius: scale(200),
      width: scale(6),
      height: scale(6),
    },
    statusText: {
      fontSize: normalize(10),
      fontFamily: Fonts.brandMedium,
    },

    alertBox: {
      width: scale(280),
      backgroundColor: Colors.background,
      padding: scale(20),
      borderRadius: scale(15),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scale(10),
    },
    dot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(5),
      backgroundColor: '#FF3B30',
      marginRight: scale(8),
      position: 'absolute',
      top: scale(-6),
      right: scale(-10),
    },
    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: normalize(18),
      color: Colors.text,
    },
    message: { color: Colors.textSecondary, marginBottom: scale(20) },
    button: { alignSelf: 'flex-end' },
    buttonText: {
      color: Colors.primary,
      fontFamily: Fonts.brandMedium,
      fontSize: normalize(14),
    },
  });
