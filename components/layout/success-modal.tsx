import { useEffect, useRef, useState } from 'react';

import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import * as Haptics from 'expo-haptics';

import LottieView from 'lottie-react-native';

import { useRouter } from 'expo-router';

import AppModal from '@/components/layout/app-modal';

import Button from '@/components/ui/buttons/button';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

type AppRoutes =
  | '/(auth)/login'
  | '/(app)/onboarding'
  | '/(auth)/register'
  | '/(app)/dashboard'
  | '/(verify)/email'
  | '/(verify)/phone';

export default function SuccessModal({
  title,
  path,
  buttonText,
  showSuccessModal,
  nextSteps,
  setShowSuccessModal,
}: {
  title: string;
  path?: AppRoutes;
  buttonText?: string;
  showSuccessModal: boolean;
  nextSteps?: string[];
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

        <Text style={styles.title}>{title}</Text>

        {nextSteps && nextSteps.length > 0 && (
          <View style={styles.stepsContainer}>
            {nextSteps?.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <View>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={Colors.success}
                  />
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}

        {path && showButton && (
          <Animated.View style={styles.buttonContainer}>
            <Button
              onPress={() => {
                setShowSuccessModal(false);

                router.push(path);
              }}
            >
              {buttonText || 'Continue'}
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
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 18,
    color: '#111827',
  },

  stepsContainer: {
    marginBottom: 28,
    gap: 20,
    backgroundColor: Colors.primaryLight,
    padding: 16,
    borderRadius: 12,
  },

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  stepText: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text,
  },

  buttonContainer: {
    marginTop: 4,
  },
});
