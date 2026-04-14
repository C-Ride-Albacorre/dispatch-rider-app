import { Colors, Fonts } from '@/constants/theme';
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
  /** Called with the full international number e.g. "+2348012345678" */
  onChangePhone?: (fullNumber: string) => void;
}

export default function PhoneInput({
  label = 'Phone Number',
  placeholder = '800 000 0000',
  errorMessage,
  inputInfo,
  onChangePhone,
}: PhoneInputProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selected, setSelected] = useState<Country>(DEFAULT_COUNTRY);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  // The local number the user types (no dial code)
  const [localNumber, setLocalNumber] = useState('');

  // ── Fetch country list ──────────────────────────────────────────────────────
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
            dial: `${c.idd.root}${c.idd.suffixes.length === 1 ? c.idd.suffixes[0] : ''}`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(parsed);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Auto-detect country from IP ─────────────────────────────────────────────
  useEffect(() => {
    if (!countries.length) return;
    (async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const match = countries.find((c) => c.code === data.country_code);
        if (match) setSelected(match);
      } catch {}
    })();
  }, [countries]);

  // ── Notify parent whenever dial code or local number changes ────────────────
  useEffect(() => {
    onChangePhone?.(localNumber ? `${selected.dial}${localNumber}` : '');
  }, [selected, localNumber]);

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search),
  );

  const hasError = !!errorMessage;

  return (
    <View style={styles.wrapper}>
      {/* Label */}
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* Input row */}
      <View style={[styles.row, hasError && styles.rowError]}>
        {/* Dial-code selector */}
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
                resizeMode="cover"
              />
              <Text style={styles.dialCode}>{selected.dial}</Text>
              <Text style={styles.chevron}>▾</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* ✅ Fully self-contained — owns its own state */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={localNumber}
          onChangeText={(text) => {
            // Strip anything that isn't a digit or leading +
            const cleaned = text.replace(/[^\d]/g, '');
            setLocalNumber(cleaned);
          }}
          keyboardType="phone-pad"
          autoComplete="tel"
          autoCorrect={false}
          returnKeyType="done"
        />
      </View>

      {hasError && <Text style={styles.error}>{errorMessage}</Text>}
      {inputInfo && <Text style={styles.info}>{inputInfo}</Text>}

      {/* ── Country picker modal ────────────────────────────────────────────── */}
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
              placeholder="Search country or dial code…"
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              autoFocus
              clearButtonMode="while-editing"
              autoCorrect={false}
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
                    setOpen(false);
                    setSearch('');
                  }}
                  activeOpacity={0.6}
                >
                  <Image
                    source={{
                      uri: `https://flagcdn.com/w40/${item.code.toLowerCase()}.png`,
                    }}
                    style={styles.flag}
                    resizeMode="cover"
                  />
                  <Text
                    style={[
                      styles.countryName,
                      isActive && styles.countryNameSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.countryDial}>{item.dial}</Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.empty}>No countries found</Text>
            }
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8, width: '100%' },

  label: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: Fonts.brandMedium,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.inputBackground,
  },
  rowError: {
    borderWidth: 1,
    borderColor: '#ef4444',
  },

  dialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  flag: { width: 22, height: 16, borderRadius: 2 },
  dialCode: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: Fonts.brandMedium,
  },
  chevron: { fontSize: 12, color: '#9ca3af' },

  divider: { width: 1, height: 24, backgroundColor: Colors.border },

  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
    fontFamily: Fonts.brandMedium,
  },

  error: { fontSize: 12, color: '#ef4444' },
  info: { fontSize: 12, color: '#6b7280' },

  // Modal
  modal: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 17,
    color: Colors.text,
    fontFamily: Fonts.brandMedium,
  },
  modalClose: {
    fontSize: 16,
    color: '#3b82f6',
    fontFamily: Fonts.brandMedium,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },

  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f3f4f6',
  },
  countryRowSelected: { backgroundColor: '#eff6ff' },
  countryName: { flex: 1, fontSize: 15, color: Colors.text },
  countryNameSelected: { color: '#3b82f6', fontFamily: Fonts.brandMedium },
  countryDial: { fontSize: 14, color: '#6b7280' },
  empty: { padding: 24, textAlign: 'center', color: '#9ca3af' },
});
