import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export type AgeGroupValue = 'children' | 'adults' | 'all';

const OPTIONS: { value: AgeGroupValue; label: string }[] = [
  { value: 'children', label: 'Дети' },
  { value: 'adults', label: 'Взрослые' },
  { value: 'all', label: 'Любой возраст' },
];

export function AgeGroupForm({
  value,
  onChange,
}: {
  value: AgeGroupValue | null;
  onChange: (next: AgeGroupValue) => void;
}) {
  return (
    <View className="gap-2">
      {OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
            className={`rounded-xl border p-4 ${
              isSelected
                ? 'border-stone-900 dark:border-white bg-stone-100 dark:bg-stone-800'
                : 'border-stone-200 dark:border-stone-700'
            }`}
          >
            <Text variant="body" className="font-medium">
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
