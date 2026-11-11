import { useEffect, useRef } from 'react';

import { Animated, Easing, Keyboard, StyleSheet, View } from 'react-native';

import * as Haptics from 'expo-haptics';

import LottieView from 'lottie-react-native';

import { useRouter } from 'expo-router';

import AppModal from '@/components/layout/app-modal';

import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
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
      Keyboard.dismiss();

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

        <View style={styles.text}>
          <ThemedText style={styles.title}>{title}</ThemedText>

          {description && (
            <ThemedText style={styles.description} themeColor="textSecondary">
              {description}
            </ThemedText>
          )}
        </View>

        {nextSteps && nextSteps.length > 0 && (
          <View style={styles.stepsContainer}>
            {nextSteps?.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={Colors.success}
                />
                <ThemedText style={styles.stepText}>{step}</ThemedText>
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
                } catch {}
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
      gap: Spacing.four,
    },

    animation: {
      width: 150,
      height: 150,
      alignSelf: 'center',
      backgroundColor: 'transparent',
    },

    text: {
      gap: Spacing.two,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
      textAlign: 'center',
    },

    description: {
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },

    stepsContainer: {
      gap: 12,
      padding: 14,
      borderRadius: 16,
      backgroundColor: Colors.primaryExtraLight,
    },

    stepContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
    },

    stepText: {
      flex: 1,
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    buttonContainer: {
      marginTop: Spacing.one,
    },
  });
