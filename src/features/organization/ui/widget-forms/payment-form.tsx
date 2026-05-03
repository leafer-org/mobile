import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/kernel/ui/text';
import { TextInput } from '@/kernel/ui/text-input';

export type PaymentStrategy = 'free' | 'one-time' | 'subscription';

export type PaymentValue = {
  strategy: PaymentStrategy;
  name: string;
  price: string;
};

const STRATEGY_LABELS: Record<PaymentStrategy, { title: string; subtitle: string }> = {
  free: { title: 'Бесплатно', subtitle: 'Без оплаты' },
  'one-time': { title: 'Разовая оплата', subtitle: 'Один платёж за услугу' },
  subscription: { title: 'Подписка', subtitle: 'Регулярные платежи' },
};

export function PaymentForm({
  value,
  onChange,
  allowedStrategies,
}: {
  value: PaymentValue;
  onChange: (next: PaymentValue) => void;
  allowedStrategies: readonly PaymentStrategy[];
}) {
  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text variant="label">Тип оплаты</Text>
        <View className="gap-2">
          {allowedStrategies.map((strategy) => {
            const isSelected = value.strategy === strategy;
            const label = STRATEGY_LABELS[strategy];
            return (
              <TouchableOpacity
                key={strategy}
                onPress={() => onChange({ ...value, strategy })}
                activeOpacity={0.7}
                className={`rounded-xl border p-3 ${
                  isSelected
                    ? 'border-stone-900 dark:border-white bg-stone-100 dark:bg-stone-800'
                    : 'border-stone-200 dark:border-stone-700'
                }`}
              >
                <Text variant="body" className="font-medium">
                  {label.title}
                </Text>
                <Text variant="caption" color="secondary">
                  {label.subtitle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="gap-2">
        <Text variant="label">Название тарифа</Text>
        <TextInput
          value={value.name}
          onChangeText={(name) => onChange({ ...value, name })}
          placeholder="Например, «Базовый»"
        />
      </View>

      {value.strategy !== 'free' && (
        <View className="gap-2">
          <Text variant="label">Цена, ₽</Text>
          <TextInput
            value={value.price}
            onChangeText={(price) => onChange({ ...value, price })}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
      )}
    </View>
  );
}
