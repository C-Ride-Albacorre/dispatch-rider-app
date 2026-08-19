import { Colors, Fonts } from '@/constants/theme';
import { normalize, scale } from '@/utils/scaling';

import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/hooks/use-theme';
import { Color } from 'expo-router';

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
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      {/* SELECT BOX */}
      <TouchableOpacity
     activeOpacity={0.8}
  disabled={disabled}
        onPress={() => !disabled && setOpen(true)}
        style={[
          styles.inputContainer,
          hasError && styles.errorContainer,
          disabled && styles.disabledContainer,
        ]}
      >
        <Text
    style={[
      styles.text,
      !selectedLabel && styles.placeholder,
      disabled && styles.disabledText,
    ]}
  >
    {selectedLabel || placeholder}
  </Text>

      <Ionicons
    name="chevron-down"
    size={20}
    color={
      disabled
        ? Colors.textSecondary + '66'
        : Colors.textSecondary
    }
  />
      </TouchableOpacity>

      {/* ERROR */}
      {hasError && <Text style={styles.errorText}>{error}</Text>}

      {/* MODAL DROPDOWN */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;

                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.selectedOption]}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    field: {
      width: '100%',
      gap: scale(6),
    },

    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(2),
    },

    label: {
      fontSize: normalize(14),
      color: Colors.text,
      fontFamily: Fonts.brandMedium,
    },

 disabledContainer: {
  backgroundColor: Colors.inputBackground ,
  opacity: 0.6,
},

disabledText: {
  color: Colors.textSecondary,
},
    required: {
      color: Colors.error,
      fontSize: normalize(14),
      fontFamily: Fonts.brandBold,
    },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',

      backgroundColor: Colors.inputBackground,
      borderRadius: scale(12),

      paddingHorizontal: scale(12),
      minHeight: scale(56),

      fontFamily: Fonts.brandRegular,

      fontSize: normalize(14),

      borderWidth: 1,
      borderColor: 'transparent',
    },

    text: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandRegular,
      color: Colors.text,
    },

    placeholder: {
      color: '#999',
         fontSize: normalize(14),
    },

    errorContainer: {
      borderColor: Colors.error,
      backgroundColor: Colors.errorLight,
    },

    errorText: {
      fontSize: normalize(12),
      color: Colors.error,
      fontFamily: Fonts.brandMedium,
      marginLeft: scale(4),
    },

    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      padding: scale(20),
    },

    dropdown: {
      backgroundColor: Colors.background,
      borderRadius: scale(12),
      maxHeight: 300,
      paddingVertical: scale(8),
    },

    option: {
      padding: scale(14),
      backgroundColor: Colors.background,
    },

    selectedOption: {
      backgroundColor: Colors.backgroundTertiary,
    },

    optionText: {
      fontSize: normalize(14),
      fontFamily: Fonts.brandRegular,
      color: Colors.text,
    },

    selectedOptionText: {
      fontFamily: Fonts.brandMedium,
      color: Colors.primary,
         fontSize: normalize(14),
    },
  });
