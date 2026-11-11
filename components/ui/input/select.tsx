import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';

import React, { useState } from 'react';
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/hooks/use-theme';

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  options: Option[];
  onChange: (value: string) => void;
};

export default function Select({
  label,
  required = false,
  disabled = false,
  error,
  placeholder = 'Select option',
  value,
  options,
  onChange,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const hasError = !!error;

  const { Colors } = useTheme();

  const styles = createStyles(Colors);

  return (
    <View style={styles.field}>
      {/* LABEL */}
      {label && (
        <ThemedText style={styles.label} themeColor="textSecondary">
          {label}
          {required && (
            <ThemedText style={styles.label} themeColor="error">
              {' '}
              *
            </ThemedText>
          )}
        </ThemedText>
      )}

      {/* SELECT BOX */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={() => {
          if (disabled) return;
          Keyboard.dismiss();
          setOpen(true);
        }}
        style={[
          styles.inputContainer,
          {
            borderColor: hasError
              ? Colors.error
              : open
                ? Colors.primary
                : Colors.border,
          },
          disabled && styles.disabledContainer,
        ]}
      >
        <ThemedText
          style={styles.text}
          themeColor={selectedLabel && !disabled ? 'text' : 'textMuted'}
          numberOfLines={1}
        >
          {selectedLabel || placeholder}
        </ThemedText>

        <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
      </TouchableOpacity>

      {/* ERROR */}
      {hasError && (
        <ThemedText style={styles.errorText} themeColor="error">
          {error}
        </ThemedText>
      )}

      {/* OPTIONS SHEET */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.root}>
          <Pressable style={styles.overlay} onPress={() => setOpen(false)} />

          <View style={styles.sheet}>
            <View style={styles.handle} />

            {label && <ThemedText style={styles.sheetTitle}>{label}</ThemedText>}

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => {
                const isSelected = item.value === value;

                return (
                  <Pressable
                    style={({ pressed }) => [
                      styles.option,
                      isSelected && styles.selectedOption,
                      pressed && styles.pressedOption,
                    ]}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {item.label}
                    </ThemedText>

                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color={Colors.primary} />
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    field: {
      width: '100%',
    },

    label: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      marginBottom: Spacing.two,
    },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.two,
      height: 52,
      paddingHorizontal: Spacing.three,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: Colors.inputBackground,
    },

    disabledContainer: {
      opacity: 0.6,
    },

    text: {
      flex: 1,
      fontFamily: Fonts.brandRegular,
      fontSize: 15,
      lineHeight: 20,
    },

    errorText: {
      fontFamily: Fonts.brandRegular,
      fontSize: 12,
      lineHeight: 16,
      marginTop: Spacing.one,
    },

    root: {
      flex: 1,
      justifyContent: 'flex-end',
    },

    overlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: Colors.overlay,
    },

    sheet: {
      maxHeight: '70%',
      paddingTop: Spacing.three,
      paddingBottom: Spacing.five,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      backgroundColor: Colors.card,
    },

    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.border,
      marginBottom: Spacing.four,
    },

    sheetTitle: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
      paddingHorizontal: Spacing.four,
      marginBottom: Spacing.three,
    },

    list: {
      paddingHorizontal: Spacing.three,
      gap: Spacing.one,
    },

    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.two,
      paddingHorizontal: Spacing.three,
      paddingVertical: 14,
      borderRadius: 12,
    },

    selectedOption: {
      backgroundColor: Colors.primaryExtraLight,
    },

    pressedOption: {
      backgroundColor: Colors.backgroundSecondary,
    },

    optionText: {
      flex: 1,
      fontFamily: Fonts.brandRegular,
      fontSize: 14,
      lineHeight: 20,
    },

    selectedOptionText: {
      fontFamily: Fonts.brandMedium,
    },
  });
