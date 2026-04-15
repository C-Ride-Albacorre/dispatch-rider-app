import { Colors, Fonts } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const STEPS = [
  { label: 'Personal\nInfo' },
  { label: 'Vehicle\nDetails' },
  { label: 'Documents' },
  { label: 'Review' },
];

type Props = { current: number; total?: number };

export default function StepIndicator({
  current,
  total = STEPS.length,
}: Props) {
  const progress = ((current - 1) / (total - 1)) * 100;

  return (
    <View style={styles.wrapper}>
      {/* Progress line + percentage */}
      <View style={styles.progressRow}>
        <Text style={styles.stepCount}>
          Step {current} of {total}
        </Text>
        <Text style={styles.percentText}>
          {Math.round(((current - 1) / (total - 1)) * 100)}% Complete
        </Text>
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
                  <Ionicons name="checkmark" size={16} color={Colors.primary} />
                ) : (
                  <Text
                    style={[styles.pillNum, isActive && styles.pillNumActive]}
                  >
                    {stepNum}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive,
                  isCompleted && styles.stepLabelCompleted,
                ]}
                numberOfLines={2}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 12, marginBottom: 24 },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepCount: {
    fontSize: 14,
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },
  percentText: {
    fontSize: 14,
    fontFamily: Fonts.brandSemiBold ?? Fonts.brandMedium,
    color: Colors.primary,
  },

  trackBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 99,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 99,
  },

  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },

  pill: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}18`,
  },
  pillCompleted: {
    borderColor: Colors.primary,
    backgroundColor: Colors.inputBackground,
  },

  pillNum: {
    fontSize: 15,
    fontFamily: Fonts.brandMedium,
    color: '#9ca3af',
  },
  pillNumActive: {
    color: Colors.primary,
    fontFamily: Fonts.brandSemiBold ?? Fonts.brandMedium,
  },

  stepLabel: {
    fontSize: 11,
    fontFamily: Fonts.brandRegular,
    color: '#9ca3af',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: Colors.text,
    fontFamily: Fonts.brandMedium,
  },
  stepLabelCompleted: {
    color: Colors.primary,
  },
});
