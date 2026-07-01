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
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const [countries, setCountries] = useState<Country[]>([]);
  const [selected, setSelected] = useState<Country>(DEFAULT_COUNTRY);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [localNumber, setLocalNumber] = useState('');

  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  // =========================
  // FETCH COUNTRIES
  // =========================
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,idd,cca2',
        );

        const data = await res.json().catch(() => []);

        const raw = Array.isArray(data) ? data : [];

        const parsed: Country[] = raw
          .filter((c) => c.idd?.root && c.idd?.suffixes?.length)
          .map((c) => ({
            name: c.name.common,
            code: c.cca2,
            dial: `${c.idd.root}${
              c.idd.suffixes.length === 1 ? c.idd.suffixes[0] : ''
            }`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(parsed);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // =========================
  // AUTO DETECT COUNTRY
  // =========================
  useEffect(() => {
    if (!countries.length) return;

    (async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();

        const match = countries.find((c) => c.code === data.country_code);

        if (match) {
          setSelected(match);
        }
      } catch {}
    })();
  }, [countries]);

  // =========================
  // SYNC CONTROLLED VALUE
  // =========================
  useEffect(() => {
    const stripped = value.startsWith(selected.dial)
      ? value.slice(selected.dial.length)
      : value;

    if (stripped !== localNumber) {
      setLocalNumber(stripped);
    }
  }, [value, selected.dial]);

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search),
  );

  const hasError = !!errorMessage;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.row, hasError && styles.rowError]}>
        <TouchableOpacity
          style={styles.dialButton}
          onPress={() => setOpen(true)}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.text} />
          ) : (
            <>
              <Image
                source={{
                  uri: `https://flagcdn.com/w40/${selected.code.toLowerCase()}.png`,
                }}
                style={styles.flag}
              />

              <Text style={styles.dialCode}>{selected.dial}</Text>

              <Ionicons name="chevron-down" style={styles.chevron} />
            </>
          )}
        </TouchableOpacity>

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
            onChangePhone?.(`${selected.dial}${cleaned}`);
          }}
          {...props}
        />
      </View>

      {hasError && <Text style={styles.error}>{errorMessage}</Text>}

      {inputInfo && <Text style={styles.info}>{inputInfo}</Text>}

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>

            <Pressable
              onPress={() => {
                setOpen(false);
                setSearch('');
              }}
            >
              <Text style={styles.modalClose}>Done</Text>
            </Pressable>
          </View>

          <View style={styles.searchRow}>
            <Text style={styles.searchIcon}>🔍</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Search country"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isActive = selected.code === item.code;

              return (
                <TouchableOpacity
                  style={[
                    styles.countryRow,
                    isActive && styles.countryRowSelected,
                  ]}
                  onPress={() => {
                    setSelected(item);

                    onChangePhone?.(`${item.dial}${localNumber}`);

                    setOpen(false);
                    setSearch('');
                  }}
                >
                  <Image
                    source={{
                      uri: `https://flagcdn.com/w40/${item.code.toLowerCase()}.png`,
                    }}
                    style={styles.flag}
                  />

                  <Text style={styles.countryName}>{item.name}</Text>

                  <Text style={styles.countryDial}>{item.dial}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
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
      borderColor: Colors.warning,
      backgroundColor: Colors.warningLight,
    },

    dialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(6),
      paddingHorizontal: scale(12),
      paddingVertical: scale(16),
    },

    flag: {
      width: scale(22),
      height: scale(16),
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

      paddingVertical: scale(16),

      fontSize: normalize(16),

      fontFamily: Fonts.brandRegular,

      color: Colors.text,
    },

    error: {
      color: Colors.warning,

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
