import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import IconButton from '@/components/ui/buttons/icon-button';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { normalize, scale } from '@/utils/scaling';

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
        variant="outlineSecondary"
        size="sm"
        onPress={onClose}
        disabled={disabled}
        style={styles.closeButton}
      >
        <Ionicons name="close" size={scale(20)} color={Colors.text} />
      </IconButton>

      <View style={styles.stepsRow}>
        {Array.from({ length: total }, (_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < current;
          const isActive = stepNum === current;
          const isReached = isCompleted || isActive;

          return (
            <Fragment key={stepNum}>
              {index > 0 && (
                <View
                  style={[
                    styles.connector,
                    isReached && { backgroundColor: Colors.error },
                  ]}
                />
              )}

              <View
                style={[
                  styles.stepCircle,
                  isReached && { backgroundColor: Colors.error },
                ]}
              >
                {isCompleted ? (
                  <Ionicons
                    name="checkmark"
                    size={scale(14)}
                    color={Colors.white}
                  />
                ) : (
                  <Text
                    style={[
                      styles.stepNum,
                      isActive && { color: Colors.white },
                    ]}
                  >
                    {stepNum}
                  </Text>
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
      marginBottom: scale(24),
    },

    stepsRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },

    stepCircle: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(16),
      backgroundColor: Colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },

    stepNum: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: normalize(13),
      color: Colors.textSecondary,
    },

    connector: {
      flex: 1,
      height: scale(2),
      marginHorizontal: scale(8),
      borderRadius: scale(1),
      backgroundColor: Colors.border,
    },

    closeButton: {
      alignSelf: 'flex-end',
      marginBottom: scale(16),
    },
  });
