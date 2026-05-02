import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

type Props = {
  picker: ReactNode;
};

export function ProfileCitySection({ picker }: Props) {
  return (
    <View className="gap-2">
      <Text variant="label" className="text-stone-600 dark:text-stone-400">
        Город
      </Text>
      {picker}
    </View>
  );
}
