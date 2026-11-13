import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/buttons/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Calendar day as `YYYY-MM-DD`. Plain strings compare chronologically. */
export type DayKey = string;

export type DayRange = { start: DayKey; end: DayKey };

export const MAX_RANGE_DAYS = 90;

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const pad = (n: number) => String(n).padStart(2, '0');

export const toDayKey = (y: number, m: number, d: number): DayKey =>
  `${y}-${pad(m + 1)}-${pad(d)}`;

const todayKey = () => {
  const now = new Date();
  return toDayKey(now.getFullYear(), now.getMonth(), now.getDate());
};

/** Inclusive number of days between two day keys. */
export const daysBetween = (a: DayKey, b: DayKey) =>
  Math.round(
    (Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000,
  ) + 1;

export function formatDayKey(key: DayKey) {
  return new Date(`${key}T00:00:00`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
}

type Props = {
  visible: boolean;
  initialRange?: DayRange | null;
  onClose: () => void;
  onApply: (range: DayRange) => void;
};

export default function DateRangeModal({ visible, onClose, ...rest }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Mounted only while open, so each opening starts from the applied range. */}
      {visible && <RangePicker onClose={onClose} {...rest} />}
    </Modal>
  );
}

function RangePicker({
  initialRange,
  onClose,
  onApply,
}: Omit<Props, 'visible'>) {
  const { Colors } = useTheme();
  const styles = createStyles(Colors);

  const today = todayKey();

  const [start, setStart] = useState<DayKey | null>(
    initialRange?.start ?? null,
  );
  const [end, setEnd] = useState<DayKey | null>(initialRange?.end ?? null);
  const [view, setView] = useState(() => {
    const anchor = initialRange?.end
      ? new Date(`${initialRange.end}T00:00:00`)
      : new Date();
    return { year: anchor.getFullYear(), month: anchor.getMonth() };
  });

  const cells = useMemo(() => {
    const firstWeekday = new Date(view.year, view.month, 1).getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const list: (DayKey | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++)
      list.push(toDayKey(view.year, view.month, d));
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [view]);

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      year: 'numeric',
    },
  );

  const isCurrentMonth =
    view.year === new Date().getFullYear() &&
    view.month === new Date().getMonth();

  const shiftMonth = (delta: number) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const handleDayPress = (day: DayKey) => {
    // First tap, or a range is already complete: start a new range.
    if (!start || end) {
      setStart(day);
      setEnd(null);
      return;
    }
    if (day < start) {
      setEnd(start);
      setStart(day);
    } else {
      setEnd(day);
    }
  };

  const rangeEnd = end ?? start;
  const rangeDays = start && rangeEnd ? daysBetween(start, rangeEnd) : 0;
  const tooLong = rangeDays > MAX_RANGE_DAYS;

  const summary = !start
    ? 'Select a start date'
    : !end
      ? `${formatDayKey(start)} · tap an end date`
      : `${formatDayKey(start)} – ${formatDayKey(end)} · ${rangeDays} days`;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      {/* Swallow taps inside the card so they don't close the modal. */}
      <Pressable style={styles.content} onPress={() => {}}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Custom range</ThemedText>
          <ThemedText
            style={styles.summary}
            themeColor={tooLong ? 'error' : 'textSecondary'}
          >
            {tooLong
              ? `Range can't be longer than ${MAX_RANGE_DAYS} days`
              : summary}
          </ThemedText>
        </View>

        <View style={styles.monthRow}>
          <Pressable
            hitSlop={10}
            onPress={() => shiftMonth(-1)}
            style={styles.navButton}
          >
            <Ionicons name="chevron-back" size={18} color={Colors.text} />
          </Pressable>
          <ThemedText style={styles.monthLabel}>{monthLabel}</ThemedText>
          <Pressable
            hitSlop={10}
            disabled={isCurrentMonth}
            onPress={() => shiftMonth(1)}
            style={[styles.navButton, isCurrentMonth && styles.disabled]}
          >
            <Ionicons name="chevron-forward" size={18} color={Colors.text} />
          </Pressable>
        </View>

        <View style={styles.grid}>
          {WEEKDAYS.map((label, i) => (
            <View key={`wd-${i}`} style={styles.cell}>
              <ThemedText style={styles.weekday} themeColor="textMuted">
                {label}
              </ThemedText>
            </View>
          ))}

          {cells.map((day, i) => {
            if (!day) return <View key={`empty-${i}`} style={styles.cell} />;

            const isFuture = day > today;
            const isEdge = day === start || day === rangeEnd;
            const inRange =
              !!start && !!rangeEnd && day > start && day < rangeEnd;

            return (
              <View
                key={day}
                style={[
                  styles.cell,
                  inRange && styles.inRange,
                  isEdge &&
                    start !== rangeEnd &&
                    day === start &&
                    styles.rangeStart,
                  isEdge &&
                    start !== rangeEnd &&
                    day === rangeEnd &&
                    styles.rangeEnd,
                ]}
              >
                <Pressable
                  disabled={isFuture}
                  onPress={() => handleDayPress(day)}
                  style={[styles.day, isEdge && styles.dayEdge]}
                >
                  <ThemedText
                    style={[
                      styles.dayText,
                      isEdge && { color: Colors.onPrimary },
                      isFuture && styles.disabled,
                      day === today && !isEdge && styles.todayText,
                    ]}
                  >
                    {Number(day.slice(-2))}
                  </ThemedText>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button variant="outline" onPress={onClose} style={styles.action}>
            Cancel
          </Button>
          <Button
            disabled={!start || tooLong}
            onPress={() => start && onApply({ start, end: end ?? start })}
            style={styles.action}
          >
            Apply
          </Button>
        </View>
      </Pressable>
    </Pressable>
  );
}

const CELL = `${100 / 7}%` as const;

const createStyles = (Colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.overlay,
      paddingHorizontal: Spacing.three,
    },

    content: {
      width: '100%',
      maxWidth: 420,
      gap: Spacing.three,
      padding: Spacing.three,
      borderRadius: 24,
      backgroundColor: Colors.card,
    },

    header: {
      gap: 2,
    },

    title: {
      fontFamily: Fonts.brandSemiBold,
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: -0.2,
    },

    summary: {
      fontFamily: Fonts.brandRegular,
      fontSize: 13,
      lineHeight: 18,
    },

    monthRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    monthLabel: {
      fontFamily: Fonts.brandMedium,
      fontSize: 15,
      lineHeight: 20,
    },

    navButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.backgroundTertiary,
    },

    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },

    cell: {
      width: CELL,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 1,
    },

    weekday: {
      fontFamily: Fonts.brandMedium,
      fontSize: 12,
      lineHeight: 16,
    },

    inRange: {
      backgroundColor: Colors.primaryExtraLight,
    },

    rangeStart: {
      backgroundColor: Colors.primaryExtraLight,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    },

    rangeEnd: {
      backgroundColor: Colors.primaryExtraLight,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },

    day: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
    },

    dayEdge: {
      backgroundColor: Colors.primary,
    },

    dayText: {
      fontFamily: Fonts.brandMedium,
      fontSize: 14,
      lineHeight: 20,
    },

    todayText: {
      color: Colors.primary,
      fontFamily: Fonts.brandBold,
    },

    disabled: {
      opacity: 0.3,
    },

    actions: {
      flexDirection: 'row',
      gap: Spacing.two,
    },

    action: {
      flex: 1,
    },
  });
