import Button from '@/components/ui/buttons/button';
import { Spacing } from '@/constants/theme';
import { ScrollView, StyleSheet } from 'react-native';

const QUICK_SUGGESTIONS = [
  "I'm on my way! 🚗",
  "I'll be there in 5 minutes",
  'Arrived at the location',
  'Please be ready with your order code',
  'Thank you for using our service',
];

type Props = {
  onSelect: (text: string) => void;
};

export function QuickSuggestions({ onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
      scrollEventThrottle={16}
    >
      {QUICK_SUGGESTIONS.map((suggestion, index) => (
        <Button
          key={index}
          size="xs"
          variant="chip"
          onPress={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
