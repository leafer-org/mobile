import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

const SHORT_DAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const SHORT_MONTHS = [
  'янв',
  'фев',
  'мар',
  'апр',
  'мая',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isTomorrow(a: Date, b: Date): boolean {
  const t = new Date(b.getTime());
  t.setDate(t.getDate() + 1);
  return isSameDay(a, t);
}

function formatTime(d: Date): string {
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function formatEventDate(iso: string, now: Date): string {
  const d = new Date(iso);
  const time = formatTime(d);
  if (isSameDay(d, now)) return `Сегодня в ${time}`;
  if (isTomorrow(d, now)) return `Завтра в ${time}`;
  const dayLabel = SHORT_DAYS[d.getDay()];
  const monthLabel = SHORT_MONTHS[d.getMonth()];
  return `${d.getDate()} ${monthLabel}, ${dayLabel}`;
}

export function EventDateLabel({ iso }: { iso: string }) {
  return (
    <View className="flex-row items-center gap-1">
      <Ionicons name="calendar-outline" size={12} color="#78716c" />
      <Text className="text-xs text-stone-700 dark:text-stone-300">
        {formatEventDate(iso, new Date())}
      </Text>
    </View>
  );
}
