import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { normalize, scale } from '@/utils/scaling';

import { DELETE_CONSEQUENCES } from './data';
import DeleteStepHeader from './delete-step-header';

export default function DeleteConsequencesStep() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <>
      <DeleteStepHeader
        icon="warning-outline"
        title="Delete Your Account?"
        description="This action is permanent and cannot be undone. Deleting your account will remove:"
      />

      <View style={styles.list}>
        {DELETE_CONSEQUENCES.map((item) => (
          <View key={item.label} style={styles.item}>
            <Ionicons name={item.icon} size={scale(18)} color={Colors.error} />

            <Text style={styles.itemText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    list: {
      width: '100%',
      gap: scale(10),
    },

    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
      borderWidth: 1,
      borderColor: `${Colors.error}33`,
      backgroundColor: Colors.errorLight,
      borderRadius: scale(12),
      paddingVertical: scale(14),
      paddingHorizontal: scale(14),
    },

    itemText: {
      flex: 1,
      fontFamily: Fonts.brandRegular,
      fontSize: normalize(13),
      color: Colors.text,
    },
  });
