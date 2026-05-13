import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/kernel/ui/text';

type Props = {
  title: string;
  tabs: ReactNode;
};

export function EmployeeInboxHeader({ title, tabs }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="px-4 pb-3 border-b border-stone-200 dark:border-stone-800"
      style={{ paddingTop: insets.top + 8 }}
    >
      <Text variant="h2">{title}</Text>
      <View className="flex-row gap-2 mt-3">{tabs}</View>
    </View>
  );
}
