import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import Documents from '@/features/onboarding/components/forms/documents';
import PersonalInfo from '@/features/onboarding/components/forms/personal-info';
import VehicleInfo from '@/features/onboarding/components/forms/vehicle-info';
import StepIndicator from '@/features/onboarding/components/step-indicator';
import { useTheme } from '@/hooks/use-theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KEYBOARD_BOTTOM_OFFSET } from '@/features/auth/components/auth-screen';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function Onboarding() {
  const router = useRouter();

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  const params = useLocalSearchParams();

  const step = Number(params.step || 1);

  const resumeStep = Number(params.resumeStep || 0);

  const goToStep = (nextStep: number) => {
    router.push(
      `/(app)/(protected)/onboarding?step=${nextStep}&resumeStep=${resumeStep}`,
    );
  };

  return (
    <KeyboardAwareScrollView
      style={styles.keyboardSafeArea}
      contentContainerStyle={styles.container}
      bottomOffset={KEYBOARD_BOTTOM_OFFSET}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>
            Join C-Ride as a Fulfillment Partner
          </ThemedText>

          <ThemedText style={styles.subtitle} themeColor="textMuted">
            Complete your profile to start delivering with care
          </ThemedText>
        </View>

        <StepIndicator current={step} />

        {step === 1 && <PersonalInfo goToStep={goToStep} />}

        {step === 2 && (
          <VehicleInfo
            goToStep={goToStep}
            currentStep={step}
            resumeStep={resumeStep}
          />
        )}

        {step === 3 && (
          <Documents
            goToStep={goToStep}
            currentStep={step}
            resumeStep={resumeStep}
          />
        )}
    </KeyboardAwareScrollView>
  );
}
const createStyles = (Colors: any) =>
  StyleSheet.create({
    keyboardSafeArea: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    container: {
      flexGrow: 1,
      gap: Spacing.four,
      padding: Spacing.three,
      paddingBottom: Spacing.five,
    },

    textContainer: {
      alignItems: 'center',
      gap: Spacing.one,
      marginTop: Spacing.three,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 26,
      lineHeight: 32,
      letterSpacing: -0.3,
      textAlign: 'center',
    },

    subtitle: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },
  });
