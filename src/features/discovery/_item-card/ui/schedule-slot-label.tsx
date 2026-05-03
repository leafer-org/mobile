import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import type { ScheduleSlot } from '../../domain/types';
import { Text } from '@/kernel/ui/text';

const SHORT_DAYS_FROM_ISO_MON1 = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

function dayLabel(slot: ScheduleSlot, now: Date): string {
  // Бэкенд хранит dayOfWeek как UTC getDay (0=вс, 1=пн, …, 6=сб).
  // Сравним с сегодняшним/завтрашним днём.
  const todayDow = now.getDay();
  const tomorrowDow = (todayDow + 1) % 7;
  if (slot.dayOfWeek === todayDow) return 'Сегодня';
  if (slot.dayOfWeek === tomorrowDow) return 'Завтра';
  // dayOfWeek в формате 0=вс — конвертируем в индекс масcива (0=пн)
  const idx = (slot.dayOfWeek + 6) % 7;
  return SHORT_DAYS_FROM_ISO_MON1[idx]!.toUpperCase().slice(0, 1) + SHORT_DAYS_FROM_ISO_MON1[idx]!.slice(1);
}

export function ScheduleSlotLabel({ slot }: { slot: ScheduleSlot }) {
  return (
    <View className="flex-row items-center gap-1">
      <Ionicons name="time-outline" size={12} color="#78716c" />
      <Text className="text-xs text-stone-700 dark:text-stone-300">
        {dayLabel(slot, new Date())} в {slot.startTime}
      </Text>
    </View>
  );
}
