import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import Input from '@/components/ui/input/input';

import { Fonts } from '@/constants/theme';

import { DELETE_CONFIRMATION_PHRASE } from './data';
import DeleteStepHeader from './delete-step-header';

export default function DeleteConfirmStep({
  confirmationText,
  setConfirmationText,
}: {
  confirmationText: string;
  setConfirmationText: (value: string) => void;
}) {
  return (
    <>
      <DeleteStepHeader
        icon="trash-outline"
        title="Confirm deletion"
        description="This is your last chance. Once deleted, your account and data cannot be recovered."
      />

      <View style={styles.field}>
        <ThemedText style={styles.instruction} themeColor="textSecondary">
          Type{' '}
          <ThemedText style={styles.phrase} themeColor="error">
            {DELETE_CONFIRMATION_PHRASE}
          </ThemedText>{' '}
          to confirm
        </ThemedText>

        <Input
          placeholder={DELETE_CONFIRMATION_PHRASE}
          value={confirmationText}
          onChangeText={setConfirmationText}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    width: '100%',
  },

  instruction: {
    fontFamily: Fonts.brandRegular,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },

  phrase: {
    fontFamily: Fonts.brandSemiBold,
    fontSize: 13,
    lineHeight: 18,
  },
});
