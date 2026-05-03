import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

import { SectionHeader } from '../section-header';

type PaymentOption = {
  name: string;
  description?: string | null;
  strategy: string;
  price?: number | null;
};

export function PaymentWidget({ options }: { options: PaymentOption[] }) {
  if (options.length === 0) return null;

  return (
    <View className="px-4 gap-2">
      <SectionHeader title="Стоимость" />
      {options.map((opt, i) => (
        <View key={i} className="flex-row items-center justify-between">
          <Text variant="body">{opt.name}</Text>
          <Text className="font-semibold text-stone-900 dark:text-white">
            {opt.strategy === 'free'
              ? 'Бесплатно'
              : opt.price != null
                ? `${opt.price.toLocaleString('ru-RU')} \u20BD${opt.strategy === 'subscription' ? ' / мес' : ''}`
                : ''}
          </Text>
        </View>
      ))}
    </View>
  );
}
