import { Colors, Fonts } from '@/constants/theme';
import Documents from '@/features/onboarding/components/forms/documents';
import PersonalInfo from '@/features/onboarding/components/forms/personal-info';
import Review from '@/features/onboarding/components/forms/review';
import VehicleInfo from '@/features/onboarding/components/forms/vehicle-info';
import StepIndicator from '@/features/onboarding/components/step-indicator';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
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
  const [step, setStep] = useState('1');

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
        <View>
          <TouchableOpacity
            style={styles.returnBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Join C-Ride as a Fulfillment Partner</Text>
          <Text style={styles.subtitle}>
            Complete your profile to start delivering with care
          </Text>
        </View>

        <StepIndicator current={parseInt(step, 10)} />

        {step === '1' && <PersonalInfo setStep={setStep} />}

        {step === '2' && <VehicleInfo setStep={setStep} />}

        {step === '3' && <Documents setStep={setStep} />}

        {step === '4' && <Review setStep={setStep} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardSafeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 24,
  },
  returnBtn: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 40,
    backgroundColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContainer: {
    gap: 8,
    alignItems: 'center',
    marginVertical: 20,
  },

  title: {
    fontSize: 26,
    fontFamily: Fonts.brandBold,
    color: Colors.text,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.brandRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
