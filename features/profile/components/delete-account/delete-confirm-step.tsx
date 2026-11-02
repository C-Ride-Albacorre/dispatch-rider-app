import { StyleSheet, Text, View } from 'react-native';

import Input from '@/components/ui/input/input';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { normalize, scale } from '@/utils/scaling';

import { DELETE_CONFIRMATION_PHRASE } from './data';
import DeleteStepHeader from './delete-step-header';

export default function DeleteConfirmStep({
  confirmationText,
  setConfirmationText,
}: {
  confirmationText: string;
  setConfirmationText: (value: string) => void;
}) {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <>
      <DeleteStepHeader
        icon="trash-outline"
        title="Confirm Deletion"
        description="This is your last chance. Once deleted, your account and data cannot be recovered."
      />

      <View style={{ width: '100%' }}>
        <Text style={styles.instruction}>
          Type <Text style={styles.phrase}>{DELETE_CONFIRMATION_PHRASE}</Text>{' '}
          to confirm
        </Text>

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

const createStyles = (Colors: any) =>
  StyleSheet.create({
    instruction: {
      fontFamily: Fonts.brandRegular,
      fontSize: normalize(13),
      color: Colors.textSecondary,
      marginBottom: scale(10),
    },

    phrase: {
      fontFamily: Fonts.brandSemiBold,
      color: Colors.error,
    },
  });
