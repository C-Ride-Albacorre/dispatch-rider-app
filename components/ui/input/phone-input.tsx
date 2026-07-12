import { Colors, Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalize, scale } from '@/utils/scaling';

import { useEffect, useState } from 'react';

type Country = {
  name: string;
  code: string;
  dial: string;
};

const DEFAULT_COUNTRY: Country = {
  name: 'Nigeria',
  code: 'NG',
  dial: '+234',
};

interface PhoneInputProps {
  label?: string;

  placeholder?: string;

  errorMessage?: string;

  inputInfo?: string;

  value?: string;

  onChangePhone?: (fullNumber: string) => void;
}

import {
  Image,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native';

export default function PhoneInput({
  label = 'Phone Number',
  placeholder = '800 000 0000',
  onChangePhone,
  errorMessage,
  inputInfo,
  value = '',
  ...props
}: PhoneInputProps) {

const DIAL_CODE = '+234';

const [localNumber, setLocalNumber] = useState('');


  const { Colors } = useTheme();
  const styles = createStyles(Colors);

useEffect(() => {
  const stripped = value.startsWith(DIAL_CODE)
    ? value.slice(DIAL_CODE.length)
    : value;

  if (stripped !== localNumber) {
    setLocalNumber(stripped);
  }
}, [value, localNumber]);

 

  const hasError = !!errorMessage;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.row, hasError && styles.rowError]}>
     <View style={styles.dialButton}>
  <Image
    source={{
      uri: 'https://flagcdn.com/w40/ng.png',
    }}
    style={styles.flag}
  />

  <Text style={styles.dialCode}>{DIAL_CODE}</Text>
</View>


        <View style={styles.divider} />

        <TextInput
       style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#9ca3af"
    value={localNumber}
    keyboardType="phone-pad"
    autoComplete="tel"
    autoCorrect={false}
    maxLength={11}
  onChangeText={(text) => {
  const cleaned = text.replace(/\D/g, '').slice(0, 11);

  setLocalNumber(cleaned);
  onChangePhone?.(`${DIAL_CODE}${cleaned}`);
}}
          {...props}
        />
      </View>

      {hasError && <Text style={styles.error}>{errorMessage}</Text>}

      {inputInfo && <Text style={styles.info}>{inputInfo}</Text>}

    
    </View>
  );
}

const createStyles = (Colors: any) =>
  StyleSheet.create({
    wrapper: {
      gap: scale(6),
      width: '100%',
    },

    label: {
      fontSize: normalize(16),
      color: Colors.text,
      fontFamily: Fonts.brandMedium,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: scale(12),
      overflow: 'hidden',
      backgroundColor: Colors.inputBackground,
    },

    rowError: {
      borderWidth: scale(1),
      borderColor: Colors.error,
      backgroundColor: Colors.errorLight,
    },

    dialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(6),
      paddingHorizontal: scale(12),
      paddingVertical: scale(16),
    },

    flag: {
      width: scale(24),
      height: scale(14),
      borderRadius: scale(2),
    },

    dialCode: {
      fontSize: normalize(15),
      color: Colors.text,
      fontFamily: Fonts.brandMedium,
    },

    chevron: {
      fontSize: normalize(12),
      color: Colors.textMuted,
    },

    divider: {
      width: scale(1),
      height: scale(24),
      backgroundColor: Colors.border,
    },

    input: {
      flex: 1,
  height: '100%',
  paddingVertical: 0,
  fontSize: normalize(16),
  fontFamily: Fonts.brandRegular,
  color: Colors.text,
  textAlignVertical: 'center',
    },

    error: {
      color: Colors.error,

      fontSize: normalize(13),
      fontFamily: Fonts.brandMedium,

      marginTop: scale(2),

      marginLeft: scale(4),
    },

    info: {
      color: '#6b7280',
      fontSize: normalize(12),
      fontFamily: Fonts.brandMedium,

      marginTop: scale(2),

      marginLeft: scale(4),
    },

    modal: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',

      alignItems: 'center',

      paddingHorizontal: scale(16),

      paddingVertical: scale(14),

      borderBottomWidth: scale(1),

      borderBottomColor: Colors.border,
    },

    modalTitle: {
      fontSize: normalize(17),
      color: Colors.text,
      fontFamily: Fonts.brandMedium,
    },

    modalClose: {
      fontSize: normalize(16),
      color: Colors.primary,
    },

    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8),
      margin: scale(12),
      paddingHorizontal: scale(12),
      paddingVertical: scale(10),
      backgroundColor: Colors.background,
      borderRadius: scale(10),
    },

    searchIcon: {
      fontSize: normalize(14),
    },

    searchInput: {
      flex: 1,
      fontSize: normalize(15),
      color: Colors.text,
    },

    countryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
      paddingHorizontal: scale(16),
      paddingVertical: scale(13),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },

    countryRowSelected: {
      backgroundColor: Colors.primary ,
    },

    countryName: {
      flex: 1,
      fontSize: normalize(15),
      color: Colors.text,
    },

    countryDial: {
      fontSize: normalize(14),
      color: Colors.textSecondary,
    },
  });
