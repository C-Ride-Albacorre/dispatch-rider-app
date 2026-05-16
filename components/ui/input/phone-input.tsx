import { Colors, Fonts } from '@/constants/theme';
import { normalize, scale } from '@/utils/scaling';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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

export default function PhoneInput({
  label = 'Phone Number',

  placeholder = '800 000 0000',

  onChangePhone,

  errorMessage,

  inputInfo,

  value = '',
}: PhoneInputProps) {
  const [countries, setCountries] = useState<Country[]>([]);

  const [selected, setSelected] = useState<Country>(DEFAULT_COUNTRY);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);

  // 🔥 LOCAL NUMBER
  const [localNumber, setLocalNumber] = useState('');

  // =========================
  // FETCH COUNTRIES
  // =========================
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,idd,cca2',
        );

        const raw: any[] = await res.json();

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
  // HANDLE CONTROLLED VALUE
  // =========================
  useEffect(() => {
    if (!value) {
      setLocalNumber('');
      return;
    }

    // Remove dial code if exists
    const stripped = value.replace(selected.dial, '');

    setLocalNumber(stripped);
  }, [value]);

  // =========================
  // SEND VALUE TO PARENT
  // =========================
  useEffect(() => {
    if (!localNumber) {
      onChangePhone?.('');
      return;
    }

    onChangePhone?.(`${selected.dial}${localNumber}`);
  }, [localNumber, selected]);

  // =========================
  // FILTER COUNTRIES
  // =========================
  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search),
  );

  const hasError = !!errorMessage;

  return (
    <View style={styles.wrapper}>
      {/* LABEL */}
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* INPUT ROW */}
      <View style={[styles.row, hasError && styles.rowError]}>
        {/* COUNTRY */}
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

        {/* INPUT */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={localNumber}
          onChangeText={(text) => {
            const cleaned = text.replace(/\D/g, '');

            setLocalNumber(cleaned);
          }}
          keyboardType="phone-pad"
          autoComplete="tel"
          autoCorrect={false}
        />
      </View>

      {/* ERROR */}
      {hasError && <Text style={styles.error}>{errorMessage}</Text>}

      {/* INFO */}
      {inputInfo && <Text style={styles.info}>{inputInfo}</Text>}

      {/* MODAL */}
      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          {/* HEADER */}
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

          {/* SEARCH */}
          <View style={styles.searchRow}>
            <Text style={styles.searchIcon}>🔍</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Search country"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* LIST */}
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

const styles = StyleSheet.create({
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
    borderColor: '#ef4444',
    backgroundColor: '#FEF2F2',
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
    color: '#9ca3af',
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
    color: '#ef4444',

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
    backgroundColor: '#fff',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',

    paddingHorizontal: scale(16),

    paddingVertical: scale(14),

    borderBottomWidth: scale(1),

    borderBottomColor: '#e5e7eb',
  },

  modalTitle: {
    fontSize: normalize(17),
    color: Colors.text,
    fontFamily: Fonts.brandMedium,
  },

  modalClose: {
    fontSize: normalize(16),
    color: '#3b82f6',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    margin: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    backgroundColor: '#f3f4f6',
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
    borderBottomColor: '#f3f4f6',
  },

  countryRowSelected: {
    backgroundColor: '#eff6ff',
  },

  countryName: {
    flex: 1,
    fontSize: normalize(15),
    color: Colors.text,
  },

  countryDial: {
    fontSize: normalize(14),
    color: '#6b7280',
  },
});
