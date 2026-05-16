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
        onPress={() => !disabled && setOpen(true)}
        style={[styles.inputContainer, hasError && styles.errorContainer, disabled && styles.disabledContainer]}
      >
        <Text style={[styles.text, !selectedLabel && styles.placeholder]}>
          {selectedLabel || placeholder}
        </Text>

        <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
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

const styles = StyleSheet.create({
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
    fontSize: normalize(16),
    color: Colors.text,
    fontFamily: Fonts.brandMedium,
  },

  disabledContainer: {
    backgroundColor: '#F3F4F6',
  },

  required: {
    color: '#EF4444',
    fontSize: normalize(16),
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

    borderWidth: 1,
    borderColor: 'transparent',
  },

  text: {
    fontSize: normalize(16),
    fontFamily: Fonts.brandRegular,
    color: Colors.text,
  },

  placeholder: {
    color: '#999',
  },

  errorContainer: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },

  errorText: {
    fontSize: normalize(13),
    color: '#EF4444',
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
    backgroundColor: '#fff',
    borderRadius: scale(12),
    maxHeight: 300,
    paddingVertical: scale(8),
  },

  option: {
    padding: scale(14),
  },

  selectedOption: {
    backgroundColor: Colors.inputBackground,
  },

  optionText: {
    fontSize: normalize(15),
    fontFamily: Fonts.brandRegular,
    color: Colors.text,
  },

  selectedOptionText: {
    fontFamily: Fonts.brandMedium,
    color: Colors.primary,
  },
});
