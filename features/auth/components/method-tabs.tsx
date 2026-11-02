import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

type IconName = keyof typeof Ionicons.glyphMap;

export type MethodTab<T extends string> = {
  value: T;
  label: string;
  icon?: IconName;
};

type MethodTabsProps<T extends string> = {
  tabs: MethodTab<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Pill-shaped switch between a few views, e.g. Email / Phone */
export default function MethodTabs<T extends string>({
  tabs,
  value,
  onChange,
}: MethodTabsProps<T>) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  return (
    <View style={styles.track} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <Pressable
            key={tab.value}
            onPress={() => onChange(tab.value)}
            style={[styles.tab, active && styles.tabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            {tab.icon && (
              <Ionicons
                name={tab.icon}
                size={16}
                color={active ? Colors.text : Colors.textMuted}
              />
            )}
            <ThemedText
              style={[styles.label, active && styles.labelActive]}
              themeColor={active ? 'text' : 'textMuted'}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    track: {
      flexDirection: 'row',
      padding: Spacing.one,
      borderRadius: 999,
      backgroundColor: Colors.backgroundTertiary,
    },

    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.one,
      height: 40,
      borderRadius: 999,
    },

    tabActive: {
      backgroundColor: Colors.card,
      shadowColor: Colors.black,
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },

    label: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
    },

    labelActive: {
      fontFamily: Fonts.brandSemiBold,
    },
  });
