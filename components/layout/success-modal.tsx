import { useEffect, useRef, useState } from 'react';

import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import * as Haptics from 'expo-haptics';

import LottieView from 'lottie-react-native';

import { useRouter } from 'expo-router';

import AppModal from '@/components/layout/app-modal';

import Button from '@/components/ui/buttons/button';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { normalize, scale } from '@/utils/scaling';

type AppRoutes =
  | '/(app)/(auth)/login'
  | '/(app)/(auth)/register'
  | '/(app)/(protected)/dashboard'
  | '/(app)/(protected)/onboarding'
  | '/(app)/(verify)/email'
  | '/(app)/(verify)/phone'
  | `/(app)/(protected)/onboarding?step=${number}`
  | `/(app)/(protected)/onboarding?step=${number}&resumeStep=${number}`
  | `/(app)/(protected)/dashboard`;

export default function SuccessModal({
  title,
  description,
  path,
  buttonText,
  showSuccessModal,
  nextSteps,
  setShowSuccessModal,
  requireVerification = false,
}: {
  title: string;
  description?: string;
  path?: AppRoutes;
  buttonText?: string;
  showSuccessModal: boolean;
  nextSteps?: string[];
  setShowSuccessModal: (value: boolean) => void;
  requireVerification?: boolean;
}) {
  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showSuccessModal) {
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
        {requireVerification ? (
          <LottieView
            source={require('@/assets/lottie/alert.json')}
            autoPlay
            loop={false}
            renderMode="HARDWARE"
            style={styles.animation}
          />
        ) : (
          <LottieView
            source={require('@/assets/lottie/success.json')}
            autoPlay
            loop={false}
            renderMode="HARDWARE"
            style={styles.animation}
          />
        )}

        <Text style={styles.title}>{title}</Text>

        {description && <Text style={styles.description}>{description}</Text>}

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

        {path && (
          <Animated.View style={styles.buttonContainer}>
            <Button
              onPress={() => {
                setShowSuccessModal(false);

                router.push(path);
              }}
              rightIcon={
                <Ionicons name="arrow-forward" size={20} color={Colors.text} />
              }
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
    width: scale(170),
    height: scale(170),
    alignSelf: 'center',
  },

  title: {
    fontSize: normalize(24),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: scale(18),
    color: '#111827',
  },

  description: {
    fontSize: normalize(16),
    textAlign: 'center',
    marginBottom: scale(24),
    color: '#6B7280',
  },

  stepsContainer: {
    marginBottom: scale(28),
    gap: scale(20),
    backgroundColor: Colors.primaryLight,
    padding: scale(16),
    borderRadius: 12,
  },

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },

  stepText: {
    fontSize: normalize(15),
    lineHeight: scale(24),
    color: Colors.text,
  },

  buttonContainer: {
    marginTop: 4,
  },
});
