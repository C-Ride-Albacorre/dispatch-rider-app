import { useEffect, useRef } from 'react';

import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import * as Haptics from 'expo-haptics';

import LottieView from 'lottie-react-native';

import { useRouter } from 'expo-router';

import AppModal from '@/components/layout/app-modal';

import Button from '@/components/ui/buttons/button';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import Ionicons from '@expo/vector-icons/Ionicons';

type AppRoutes =
  | '/(app)/(auth)/login'
  | '/(app)/(auth)/register'
  | '/(app)/(auth)/reset'
  | '/(app)/(protected)/(tabs)/home'
  | '/(app)/(protected)/onboarding'
  | '/(app)/(verify)/email'
  | '/(app)/(verify)/phone'
  | `/(app)/(protected)/onboarding?step=${number}`
  | `/(app)/(protected)/onboarding?step=${number}&resumeStep=${number}`
  | `/(app)/(protected)/(tabs)/home`;

type SuccessModalProps = {
  title: string;
  description?: string;
  path?: AppRoutes;
  buttonText?: string;
  showSuccessModal: boolean;
  nextSteps?: string[];
  setShowSuccessModal: (value: boolean) => void;
  requireVerification?: boolean;
  onContinue?: () => void | Promise<void>;
};

export default function SuccessModal({
  title,
  description,
  path,
  buttonText,
  showSuccessModal,
  nextSteps,
  setShowSuccessModal,
  requireVerification = false,
  onContinue,
}: SuccessModalProps) {
  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  const opacityAnim = useRef(new Animated.Value(0)).current;

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

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
        <LottieView
          source={
            requireVerification
              ? require('@/assets/lottie/alert.json')
              : require('@/assets/lottie/success.json')
          }
          autoPlay
          loop={false}
          style={styles.animation}
        />

        <View>
          <Text style={styles.title}>{title}</Text>

          {description && <Text style={styles.description}>{description}</Text>}
        </View>

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
              onPress={async () => {
                try {
                  if (onContinue) {
                    await onContinue();
                    return;
                  }

                  setShowSuccessModal(false);

                  router.replace(path);
                } catch (error) {
                  console.log('Modal continue error:', error);
                }
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

const createStyles = (Colors: any) =>
  StyleSheet.create({
    content: {
      width: '100%',
    },

    animation: {
      width: scale(170),
      height: scale(170),
      alignSelf: 'center',
      backgroundColor: 'transparent',
    },

    title: {
      fontSize: normalize(20),
      textAlign: 'center',
      fontFamily: Fonts.brandSemiBold,
      marginBottom: scale(18),
      color: Colors.text,
    },

    description: {
      fontSize: normalize(12),
      lineHeight: scale(20),
      fontFamily: Fonts.brandRegular,
      textAlign: 'center',
      marginBottom: scale(24),
      color: Colors.textSecondary,
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
      fontSize: normalize(12),
      fontFamily: Fonts.brandRegular,
      lineHeight: scale(24),
      color: Colors.text,
    },

    buttonContainer: {
      marginTop: scale(4),
    },
  });
