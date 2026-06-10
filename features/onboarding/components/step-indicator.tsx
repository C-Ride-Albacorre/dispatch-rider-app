import { Colors, Fonts } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';

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
                  <Ionicons name="checkmark" size={16} color={Colors.success} />
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

const createStyles = (Colors: any) =>
  StyleSheet.create({
    wrapper: { gap: scale(12), marginBottom: scale(24) },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepCount: {
    fontSize: normalize(14),
    fontFamily: Fonts.brandMedium,
    color: Colors.text,
  },
  percentText: {
    fontSize: normalize(14),
    fontFamily: Fonts.brandSemiBold ?? Fonts.brandMedium,
    color: Colors.success,
  },

  trackBg: {
    height: scale(6),
    backgroundColor: Colors.border,
    borderRadius: scale(99),
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: scale(99),
  },

  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(4),
  },
  stepItem: {
    alignItems: 'center',
    gap: scale(6),
    flex: 1,
  },

  pill: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(12),
    borderWidth: scale(1.5),
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
    borderColor: Colors.success,
    backgroundColor: Colors.successExtraLight,
  },

  pillNum: {
    fontSize: normalize(15),
    fontFamily: Fonts.brandMedium,
    color: '#9ca3af',
  },
  pillNumActive: {
    color: Colors.primary,
    fontFamily: Fonts.brandSemiBold ?? Fonts.brandMedium,
  },

  stepLabel: {
    fontSize: normalize(12),
    fontFamily: Fonts.brandRegular,
    color: '#9ca3af',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: Colors.text,
    fontFamily: Fonts.brandMedium,
  },
  stepLabelCompleted: {
    color: Colors.success,
  },
});
