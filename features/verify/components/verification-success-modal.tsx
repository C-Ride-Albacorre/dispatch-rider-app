import { useEffect, useRef, useState } from 'react';

import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import * as Haptics from 'expo-haptics';

import LottieView from 'lottie-react-native';

import { useRouter } from 'expo-router';

import AppModal from '@/components/layout/app-modal';

import Button from '@/components/ui/buttons/button';
import { clearVerificationData } from '@/utils/token-storage';

export default function VerificationSuccessModal({
  showSuccessModal,
  nextSteps,
  setShowSuccessModal,
}: {
  showSuccessModal: boolean;
  nextSteps: string[];
  setShowSuccessModal: (value: boolean) => void;
}) {
  const router = useRouter();

  const [showButton, setShowButton] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showSuccessModal) {
      // reset state
      setShowButton(false);

      // haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // entrance animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 80,
          useNativeDriver: true,
        }),

        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [showSuccessModal]);

  return (
    <AppModal
      visible={showSuccessModal}
      onClose={() => setShowSuccessModal(false)}
      closeOnBackdropPress={false}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* SUCCESS ANIMATION */}
        <LottieView
          source={require('@/assets/lottie/success.json')}
          autoPlay
          loop={false}
          renderMode="HARDWARE"
          style={styles.animation}
          onAnimationFinish={() => {
            setShowButton(true);
          }}
        />

        <View>
          <Text style={styles.title}>Verification Successful</Text>

          <Text style={styles.subTitle}>
            Your account has been successfully created. Please proceed with the
            following steps to complete your onboarding:
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          {nextSteps.map((step, index) => (
            <Text key={index} style={styles.stepText}>
              {index + 1}. {step}
            </Text>
          ))}
        </View>

        {/* DELAYED BUTTON */}
        {showButton && (
          <Animated.View style={styles.buttonContainer}>
            <Button
              onPress={() => {
                setShowSuccessModal(false);

                clearVerificationData();

                router.push('/(app)/onboarding');
              }}
            >
              Start Onboarding
            </Button>
          </Animated.View>
        )}
      </Animated.View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },

  animation: {
    width: 170,
    height: 170,
    alignSelf: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
    color: '#111827',
  },

    subTitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: '#4B5563',
  },

  stepsContainer: {
    marginBottom: 28,
    gap: 12,
  },

  stepText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
  },

  buttonContainer: {
    marginTop: 4,
  },
});
