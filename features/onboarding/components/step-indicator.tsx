import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

const STEPS = [
  { label: 'Personal\nInfo' },
  { label: 'Vehicle\nDetails' },
  { label: 'Documents' },
  // { label: 'Review' },
];

type Props = { current: number; total?: number };

export default function StepIndicator({
  current,
  total = STEPS.length,
}: Props) {
  const progress = ((current - 1) / (total - 1)) * 100;

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.wrapper}>
      {/* Progress line + percentage */}
      <View style={styles.progressRow}>
        <ThemedText style={styles.stepCount} themeColor="textSecondary">
          Step {current} of {total}
        </ThemedText>
        <ThemedText style={styles.percentText} themeColor="primary">
          {Math.round(((current - 1) / (total - 1)) * 100)}% Complete
        </ThemedText>
      </View>
      <View style={styles.trackBg}>
        <View style={[styles.trackFill, { width: `${progress}%` }]} />
      </View>

      {/* Step pills */}
      <View style={styles.stepsRow}>
        {STEPS.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < current;
          const isActive = stepNum === current;

          return (
            <View key={index} style={styles.stepItem}>
              <View
                style={[
                  styles.pill,
                  isCompleted && styles.pillCompleted,
                  isActive && styles.pillActive,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={16} color={Colors.white} />
                ) : (
                  <ThemedText
                    style={[styles.pillNum, isActive && styles.pillNumActive]}
                    themeColor={isActive ? 'onPrimary' : 'textMuted'}
                  >
                    {stepNum}
                  </ThemedText>
                )}
              </View>
              <ThemedText
                style={[
                  styles.stepLabel,
                  (isActive || isCompleted) && styles.stepLabelActive,
                ]}
                themeColor={isActive ? 'text' : isCompleted ? 'success' : 'textMuted'}
                numberOfLines={2}
              >
                {step.label}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    wrapper: {
      gap: 12,
      marginBottom: Spacing.four,
    },

    progressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    stepCount: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 17,
    },

    percentText: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 12,
      lineHeight: 17,
    },

    trackBg: {
      height: 6,
      backgroundColor: Colors.backgroundTertiary,
      borderRadius: 999,
      overflow: 'hidden',
    },

    trackFill: {
      height: '100%',
      backgroundColor: Colors.primary,
      borderRadius: 999,
    },

    stepsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: Spacing.one,
    },

    stepItem: {
      flex: 1,
      alignItems: 'center',
      gap: 6,
    },

    pill: {
      width: 36,
      height: 36,
      borderRadius: 999,
      backgroundColor: Colors.backgroundTertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    pillActive: {
      backgroundColor: Colors.primary,
    },

    pillCompleted: {
      backgroundColor: Colors.success,
    },

    pillNum: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
    },

    pillNumActive: {
      fontFamily: Fonts.brandSemiBold,
    },

    stepLabel: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 17,
      textAlign: 'center',
    },

    stepLabelActive: {
      fontFamily: Fonts.brandMedium,
    },
  });
