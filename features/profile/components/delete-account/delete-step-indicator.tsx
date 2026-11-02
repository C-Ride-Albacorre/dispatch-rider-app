import { Ionicons } from '@expo/vector-icons';
import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import IconButton from '@/components/ui/buttons/icon-button';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function DeleteStepIndicator({
  current,
  total,
  onClose,
  disabled,
}: {
  current: number;
  total: number;
  onClose: () => void;
  disabled?: boolean;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.container}>
      <IconButton
        icon="close"
        size="md"
        variant="soft"
        onPress={onClose}
        disabled={disabled}
        style={styles.closeButton}
        accessibilityLabel="Close"
      />

      <View style={styles.stepsRow}>
        {Array.from({ length: total }, (_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < current;
          const isActive = stepNum === current;
          const isReached = isCompleted || isActive;

          return (
            <Fragment key={stepNum}>
              {index > 0 && (
                <View style={[styles.connector, isReached && styles.reached]} />
              )}

              <View style={[styles.stepCircle, isReached && styles.reached]}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color={Colors.white} />
                ) : (
                  <ThemedText
                    style={styles.stepNum}
                    themeColor={isActive ? 'white' : 'textSecondary'}
                  >
                    {stepNum}
                  </ThemedText>
                )}
              </View>
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: Spacing.four,
    },

    stepsRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },

    stepCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: Colors.backgroundTertiary,
      justifyContent: 'center',
      alignItems: 'center',
    },

    reached: {
      backgroundColor: Colors.error,
    },

    stepNum: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 13,
      lineHeight: 18,
    },

    connector: {
      flex: 1,
      height: 2,
      marginHorizontal: Spacing.two,
      borderRadius: 1,
      backgroundColor: Colors.backgroundTertiary,
    },

    closeButton: {
      alignSelf: 'flex-end',
      marginBottom: Spacing.three,
    },
  });
