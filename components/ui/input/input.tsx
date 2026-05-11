import { Colors, Fonts } from '@/constants/theme';
import { normalize, scale } from '@/utils/scaling';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
    fontSize: normalize(16),
    color: Colors.text,
    fontFamily: Fonts.brandMedium,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    width: '100%',
  },

  input: {
    flex: 1,
    paddingVertical: scale(16),
    fontSize: normalize(16),
    fontFamily: Fonts.brandRegular,
    color: Colors.text,
  },

  iconLeft: {
    marginRight: scale(8),
  },

  iconRight: {
    marginLeft: scale(8),
  },
});
