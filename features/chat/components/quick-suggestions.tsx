import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

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
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      scrollEventThrottle={16}
    >
      {QUICK_SUGGESTIONS.map((suggestion, index) => (
        <Pressable
          key={index}
          onPress={() => onSelect(suggestion)}
          style={({ pressed }) => [
            styles.suggestion,
            pressed && styles.suggestionPressed,
          ]}
        >
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      gap: scale(8),
      paddingHorizontal: scale(14),
      paddingVertical: scale(10),
      backgroundColor: Colors.background,
    },
    suggestion: {
      paddingVertical: scale(8),
      paddingHorizontal: scale(12),
      borderRadius: scale(18),
      backgroundColor: Colors.primaryLight,
      borderWidth: 1,
      borderColor: Colors.primary,
      justifyContent: 'center',
    },
    suggestionPressed: {
      backgroundColor: Colors.primary,
      opacity: 0.9,
    },
    suggestionText: {
      fontSize: normalize(10),
      fontFamily: Fonts.brandMedium,
      color: Colors.text,
      maxWidth: scale(140),
    },
  });
