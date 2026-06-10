import { Colors, Fonts } from '@/constants/theme';
import Documents from '@/features/onboarding/components/forms/documents';
import PersonalInfo from '@/features/onboarding/components/forms/personal-info';
import Review from '@/features/onboarding/components/forms/review';
import VehicleInfo from '@/features/onboarding/components/forms/vehicle-info';
import StepIndicator from '@/features/onboarding/components/step-indicator';
import { useTheme } from '@/hooks/use-theme';
import { scale } from '@/utils/scaling';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
    <KeyboardAvoidingView
      style={styles.keyboardSafeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>Join C-Ride as a Fulfillment Partner</Text>

          <Text style={styles.subtitle}>
            Complete your profile to start delivering with care
          </Text>
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
      </ScrollView>
    </KeyboardAvoidingView>
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
      padding: scale(20),
      gap: scale(24),
      marginBottom: scale(40),
    },
    returnBtn: {
      alignSelf: 'flex-start',
      padding: scale(8),
      borderRadius: scale(40),
      backgroundColor: Colors.light,
      alignItems: 'center',
      justifyContent: 'center',
    },

    textContainer: {
      gap: scale(8),
      alignItems: 'center',
      marginVertical: scale(20),
    },

    title: {
      fontSize: scale(26),
      fontFamily: Fonts.brandBold,
      color: Colors.text,
      textAlign: 'center',
    },

    subtitle: {
      fontSize: scale(16),
      fontFamily: Fonts.brandRegular,
      color: Colors.textSecondary,
      textAlign: 'center',
    },
  });
