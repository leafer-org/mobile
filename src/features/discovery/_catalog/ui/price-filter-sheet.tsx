import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/kernel/ui/button';
import { Text } from '@/kernel/ui/text';
import { TextInput } from '@/kernel/ui/text-input';

import { BottomSheet } from '../../ui/bottom-sheet';

type Props = {
  visible: boolean;
  initialMin?: number;
  initialMax?: number;
  onApply: (min: number | undefined, max: number | undefined) => void;
  onClose: () => void;
};

export function PriceFilterSheet({
  visible,
  initialMin,
  initialMax,
  onApply,
  onClose,
}: Props) {
  const [min, setMin] = useState<string>('');
  const [max, setMax] = useState<string>('');

  useEffect(() => {
    if (!visible) return;
    setMin(initialMin?.toString() ?? '');
    setMax(initialMax?.toString() ?? '');
  }, [visible, initialMin, initialMax]);

  const handleApply = () => {
    onApply(min ? Number(min) : undefined, max ? Number(max) : undefined);
    onClose();
  };

  const handleReset = () => {
    onApply(undefined, undefined);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="bg-white dark:bg-stone-900 rounded-t-2xl px-4 pt-4 pb-8 gap-4">
        <Text variant="h3">Цена</Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <TextInput
              testID="price-sheet-min"
              placeholder="от"
              keyboardType="numeric"
              value={min}
              onChangeText={setMin}
            />
          </View>
          <View className="flex-1">
            <TextInput
              testID="price-sheet-max"
              placeholder="до"
              keyboardType="numeric"
              value={max}
              onChangeText={setMax}
            />
          </View>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Button variant="ghost" onPress={handleReset}>
              Сбросить
            </Button>
          </View>
          <View className="flex-1">
            <Button variant="primary" onPress={handleApply}>
              Применить
            </Button>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
