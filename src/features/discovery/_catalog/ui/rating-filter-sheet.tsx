import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/kernel/ui/text';
import { cn } from '@/kernel/ui/utils/cn';

import { BottomSheet } from '../../ui/bottom-sheet';

type Props = {
  visible: boolean;
  current?: number;
  onApply: (rating: number | undefined) => void;
  onClose: () => void;
};

const OPTIONS = [3, 4, 4.5];

export function RatingFilterSheet({ visible, current, onApply, onClose }: Props) {
  const handleSelect = (value: number) => {
    onApply(current === value ? undefined : value);
    onClose();
  };

  const handleReset = () => {
    onApply(undefined);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="bg-white dark:bg-stone-900 rounded-t-2xl px-4 pt-4 pb-8 gap-4">
        <Text variant="h3">Минимальный рейтинг</Text>
        <View className="flex-row gap-2">
          {OPTIONS.map((value) => {
            const isActive = current === value;
            return (
              <TouchableOpacity
                key={value}
                testID={`rating-sheet-${value}`}
                activeOpacity={0.7}
                onPress={() => handleSelect(value)}
                className={cn(
                  'flex-1 py-2 rounded-md border items-center',
                  isActive
                    ? 'border-stone-900 bg-stone-100 dark:bg-stone-800 dark:border-white'
                    : 'border-stone-300 dark:border-stone-700',
                )}
              >
                <Text
                  className={cn(
                    'text-sm',
                    isActive
                      ? 'text-stone-900 dark:text-white font-semibold'
                      : 'text-stone-600 dark:text-stone-400',
                  )}
                >
                  {value}+
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {current != null && (
          <TouchableOpacity onPress={handleReset} hitSlop={4}>
            <Text className="text-sm text-stone-500 dark:text-stone-400 text-center">
              Сбросить
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </BottomSheet>
  );
}
