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
    <View className="flex-row bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
      {OPTIONS.map((option) => {
        const isActive = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
            className={cn(
              'px-3 py-1.5 rounded-md',
              isActive && 'bg-white dark:bg-slate-600 shadow-sm',
            )}
          >
            <Text
              className={cn(
                'text-xs font-medium',
                isActive
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-slate-500 dark:text-slate-400',
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
