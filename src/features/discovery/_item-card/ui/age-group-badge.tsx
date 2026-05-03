import { View } from 'react-native';

import type { CardAgeGroup } from '../../domain/types';
import { Text } from '@/kernel/ui/text';

const LABELS: Record<CardAgeGroup, string> = {
  adults: 'Взрослым',
  children: 'Детям',
  all: 'Всем',
};

export function AgeGroupBadge({ ageGroup }: { ageGroup: CardAgeGroup }) {
  return (
    <View className="self-start px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800">
      <Text className="text-[10px] text-stone-600 dark:text-stone-400">{LABELS[ageGroup]}</Text>
    </View>
  );
}
