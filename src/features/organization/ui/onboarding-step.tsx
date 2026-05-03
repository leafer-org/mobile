import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export function OnboardingStep({
  step,
  total,
  title,
  subtitle,
  children,
  actions,
}: {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <View className="flex-1 gap-6">
      <View className="gap-2">
        <Text variant="caption" className="text-stone-500 dark:text-stone-400">
          Шаг {step} из {total}
        </Text>
        <Text variant="h2">{title}</Text>
        {subtitle && (
          <Text variant="body" className="text-stone-600 dark:text-stone-300">
            {subtitle}
          </Text>
        )}
      </View>

      <View className="flex-1 gap-4">{children}</View>

      <View className="gap-2 pb-4">{actions}</View>
    </View>
  );
}
