import AuthPageHeader from '@/components/layout/auth-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import IconButton from '@/components/ui/buttons/icon-button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

type AuthScreenProps = {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  /** Shows a back button above the logo */
  onBack?: () => void;
};

/**
 * Back button, logo and heading shared by the auth and verify screens.
 * The auth/verify stacks already pad for the safe area.
 */
export default function AuthScreen({ title, subtitle, children, onBack }: AuthScreenProps) {
  return (
    <ThemedView style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {onBack && (
            <IconButton
              icon="chevron-back"
              size="md"
              onPress={onBack}
              accessibilityLabel="Go back"
              style={styles.back}
            />
          )}

          <AuthPageHeader title={title} subtitle={subtitle} />

          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

/** The server's reason a submit failed */
export function FormError({ message }: { message?: string | null }) {
  const { Colors } = useTheme();
  if (!message) return null;

  return (
    <View style={[styles.formError, { backgroundColor: Colors.errorLight }]} role="alert">
      <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
      <ThemedText style={styles.formErrorText} themeColor="error">
        {message}
      </ThemedText>
    </View>
  );
}

/** "Don't have an account? Register" style link under a form */
export function AuthSwitch({
  prompt,
  action,
  onPress,
}: {
  prompt: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <ThemedText style={styles.switch} themeColor="textMuted">
      {prompt}{' '}
      <ThemedText style={styles.switchAction} themeColor="primary" onPress={onPress}>
        {action}
      </ThemedText>
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },

  back: {
    alignSelf: 'flex-start',
  },

  formError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: 12,
    borderRadius: 14,
  },

  formErrorText: {
    flex: 1,
    fontFamily: Fonts.brandMedium,
    fontSize: 13,
    lineHeight: 18,
  },

  switch: {
    fontFamily: Fonts.brandRegular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },

  switchAction: {
    fontFamily: Fonts.brandSemiBold,
    fontSize: 14,
    lineHeight: 20,
  },
});
