import { useAmountVisibility } from '@/store/amount-visibility-store';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

/** Eye button that shows or hides money figures across home and earnings. */
export default function AmountVisibilityToggle({
  color,
  size = 18,
}: {
  color: string;
  size?: number;
}) {
  const hidden = useAmountVisibility((s) => s.hidden);
  const toggle = useAmountVisibility((s) => s.toggle);

  return (
    <Pressable
      onPress={toggle}
      hitSlop={10}
      style={({ pressed }) => [styles.base, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={hidden ? 'Show amounts' : 'Hide amounts'}
    >
      <Ionicons
        name={hidden ? 'eye-off-outline' : 'eye-outline'}
        size={size}
        color={color}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 2,
  },

  pressed: {
    opacity: 0.6,
  },
});
