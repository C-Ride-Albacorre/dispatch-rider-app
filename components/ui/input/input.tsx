import { Colors, Fonts } from '@/constants/theme';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function Input({
  label,
  ...props
}: { label?: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput {...props} style={[styles.input, props.style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    gap: 8,
  },

  label: {
    fontSize: 16,

    color: Colors.text,
    fontFamily: Fonts.brandMedium,
  },

  input: {
    // borderWidth: 1,
    // borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: Colors.inputBackground,
  },


});
