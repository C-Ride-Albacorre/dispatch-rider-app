import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import Input from '@/components/ui/input/input';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { DELETE_REASONS } from './data';
import DeleteStepHeader from './delete-step-header';

export default function DeleteReasonStep({
  selectedReason,
  setSelectedReason,
  customReason,
  setCustomReason,
}: {
  selectedReason: string;
  setSelectedReason: (value: string) => void;
  customReason: string;
  setCustomReason: (value: string) => void;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <>
      <DeleteStepHeader
        icon="chatbubble-ellipses-outline"
        title="Why are you leaving?"
        description="We're sorry to see you go. Tell us why so we can improve C-Ride."
      />

      <View style={styles.card}>
        {DELETE_REASONS.map((item, index) => {
          const isSelected = selectedReason === item;

          return (
            <Pressable
              key={item}
              onPress={() => setSelectedReason(item)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.row,
                index === DELETE_REASONS.length - 1 && styles.lastRow,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText
                style={[styles.reasonText, isSelected && styles.reasonSelected]}
                themeColor={isSelected ? 'error' : 'text'}
              >
                {item}
              </ThemedText>

              <Ionicons
                name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={isSelected ? Colors.error : Colors.textMuted}
              />
            </Pressable>
          );
        })}
      </View>

      {selectedReason === 'Other' && (
        <View style={styles.field}>
          <Input
            placeholder="Enter your reason"
            value={customReason}
            onChangeText={setCustomReason}
          />
        </View>
      )}
    </>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    card: {
      width: '100%',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.card,
      overflow: 'hidden',
      marginBottom: 12,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
    },

    lastRow: {
      borderBottomWidth: 0,
    },

    pressed: {
      backgroundColor: Colors.backgroundSecondary,
    },

    reasonText: {
      flex: 1,
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
    },

    reasonSelected: {
      fontFamily: Fonts.brandMedium,
    },

    field: {
      width: '100%',
      marginTop: Spacing.one,
    },
  });
