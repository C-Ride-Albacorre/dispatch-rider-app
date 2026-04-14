import { Colors, Fonts } from '@/constants/theme';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';

type InputProps = {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
} & React.ComponentProps<typeof TextInput>;

export default function Input({
  label,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...props
}: InputProps) {
  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          {...props}
          style={[styles.input, props.style]}
          placeholderTextColor="#999"
        />

        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <View style={styles.iconRight}>{rightIcon}</View>
          </TouchableOpacity>
        )}
      </View>
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

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    width: '100%',
  },

  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: Fonts.brandRegular,
    color: Colors.text,
  },

  iconLeft: {
    marginRight: 8,
  },

  iconRight: {
    marginLeft: 8,
  },
});
