import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { DELETE_CONSEQUENCES } from './data';
import DeleteStepHeader from './delete-step-header';

export default function DeleteConsequencesStep() {
  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <>
      <DeleteStepHeader
        icon="warning-outline"
        title="Delete your account?"
        description="This action is permanent and cannot be undone. Deleting your account will remove:"
      />

      <View style={styles.card}>
        {DELETE_CONSEQUENCES.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.item,
              index === DELETE_CONSEQUENCES.length - 1 && styles.lastItem,
            ]}
          >
            <Ionicons name={item.icon} size={18} color={Colors.error} />

            <ThemedText style={styles.itemText}>{item.label}</ThemedText>
          </View>
        ))}
      </View>
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
    },

    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
    },

    lastItem: {
      borderBottomWidth: 0,
    },

    itemText: {
      flex: 1,
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
    },
  });
