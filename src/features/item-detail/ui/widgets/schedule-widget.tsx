import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

import { SectionHeader } from '../section-header';

const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

type Entry = { dayOfWeek: number; startTime: string; endTime: string };

export function ScheduleWidget({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) return null;

  return (
    <View className="px-4 gap-2">
      <SectionHeader title="Расписание" />
      {entries.map((e, i) => (
        <View key={i} className="flex-row items-center justify-between">
          <Text variant="body">{DAY_NAMES[e.dayOfWeek] ?? e.dayOfWeek}</Text>
          <Text variant="caption">{e.startTime} — {e.endTime}</Text>
        </View>
      ))}
    </View>
  );
}
