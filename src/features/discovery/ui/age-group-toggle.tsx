import { TouchableOpacity, View } from 'react-native';

import type { AgeGroup } from '../domain/types';
import { Text } from '@/kernel/ui/text';
import { cn } from '@/kernel/ui/utils/cn';

type Props = {
  value: AgeGroup;
  onChange: (value: AgeGroup) => void;
};

const OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: 'adults', label: 'Взрослые' },
  { value: 'children', label: 'Дети' },
];

export function AgeGroupToggle({ value, onChange }: Props) {
  return (
    <View className="flex-row bg-stone-100 dark:bg-stone-800 rounded-md p-0.5">
      {OPTIONS.map((option) => {
        const isActive = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
            className={cn(
              'flex-1 py-1.5 rounded items-center',
              isActive && 'bg-stone-200 dark:bg-stone-700',
            )}
          >
            <Text
              className={cn(
                'text-xs',
                isActive
                  ? 'text-stone-900 dark:text-white'
                  : 'text-stone-500 dark:text-stone-400',
              )}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
