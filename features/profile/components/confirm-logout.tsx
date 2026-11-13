import AppModal from '@/components/layout/app-modal';
import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ConfirmLogout({
  showLogoutModal,
  setShowLogoutModal,
  title = 'Sign out?',
  description = 'Are you sure you want to sign out? You will need to log in again to access your account.',
  confirmLabel = 'Sign out',
}: {
  showLogoutModal: boolean;
  setShowLogoutModal: (value: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
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
          <Ionicons name="log-out-outline" size={28} color={Colors.error} />
        </View>

        <ThemedText style={styles.logoutTitle}>{title}</ThemedText>

        <ThemedText style={styles.logoutDescription} themeColor="textSecondary">
          {description}
        </ThemedText>

        <View style={styles.actionContainer}>
          <Button
            variant="outline"
            disabled={isLoggingOut}
            onPress={() => setShowLogoutModal(false)}
            style={styles.logoutButton}
          >
            Cancel
          </Button>

          <Button
            variant="red"
            loading={isLoggingOut}
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            {confirmLabel}
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
      paddingVertical: Spacing.two,
    },

    logoutIconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: Colors.errorLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.three,
    },

    logoutTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
      marginBottom: Spacing.two,
    },

    logoutDescription: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      marginBottom: Spacing.four,
    },

    actionContainer: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },

    logoutButton: {
      flex: 1,
    },
  });
