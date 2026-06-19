import AppModal from '@/components/layout/app-modal';
import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { normalize, scale } from '@/utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import { act, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ConfirmLogout({
  showLogoutModal,
  setShowLogoutModal,
}: {
  showLogoutModal: boolean;
  setShowLogoutModal: (value: boolean) => void;
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <AppModal
      visible={showLogoutModal}
      onClose={() => setShowLogoutModal(false)}
      closeOnBackdropPress={!isLoggingOut}
    >
      <View style={styles.logoutModal}>
        <View style={styles.logoutIconWrapper}>
          <Ionicons
            name="log-out-outline"
            size={scale(32)}
            color={Colors.error}
          />
        </View>

        <Text style={styles.logoutTitle}>Sign Out</Text>

        <Text style={styles.logoutDescription}>
          Are you sure you want to sign out? You will need to log in again to
          access your account.
        </Text>

        <View style={styles.actionContainer}>
          <Button
            variant="red"
            loading={isLoggingOut}
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            Yes, Sign Out
          </Button>

          <Button
            variant="outline"
            disabled={isLoggingOut}
            onPress={() => setShowLogoutModal(false)}
            style={styles.logoutButton}
          >
            Cancel
          </Button>
        </View>
      </View>
    </AppModal>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    logoutModal: {
      alignItems: 'center',
      paddingVertical: scale(8),
    },

    logoutIconWrapper: {
      width: scale(64),
      height: scale(64),
      borderRadius: scale(32),
      backgroundColor: Colors.errorLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: scale(16),
    },

    logoutTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: normalize(18),
      color: Colors.text,
      marginBottom: scale(8),
    },

    logoutDescription: {
      fontFamily: Fonts.brandRegular,
      fontSize: normalize(13),
      color: Colors.textSecondary,
      textAlign: 'center',
      lineHeight: normalize(20),
      marginBottom: scale(24),
    },

    actionContainer: {
      flexDirection: 'row',
      gap: scale(12),
      width: '100%',
    },

    logoutButton: {
      flex: 1,
    },
  });
