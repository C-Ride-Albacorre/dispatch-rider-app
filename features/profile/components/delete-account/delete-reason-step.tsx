import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Input from '@/components/ui/input/input';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { normalize, scale } from '@/utils/scaling';

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
        title="Why Are You Leaving?"
        description="We're sorry to see you go. Tell us why so we can improve C-Ride."
      />

      <View style={styles.reasonsContainer}>
        {DELETE_REASONS.map((item) => {
          const isSelected = selectedReason === item;

          return (
            <TouchableOpacity
              key={item}
              activeOpacity={0.8}
              onPress={() => setSelectedReason(item)}
              style={[
                styles.reasonButton,
                isSelected && {
                  borderColor: Colors.error,
                  backgroundColor: Colors.errorLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.reasonText,
                  isSelected && {
                    color: Colors.error,
                    fontFamily: Fonts.brandSemiBold,
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedReason === 'Other' && (
        <View style={{ width: '100%' }}>
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
    reasonsContainer: {
      width: '100%',
      gap: scale(10),
      marginBottom: scale(12),
    },

    reasonButton: {
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: scale(12),
      paddingVertical: scale(14),
      paddingHorizontal: scale(14),
      width: '100%',
    },

    reasonText: {
      fontFamily: Fonts.brandRegular,
      fontSize: normalize(13),
      color: Colors.text,
    },
  });
