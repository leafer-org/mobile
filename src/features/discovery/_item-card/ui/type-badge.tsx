import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export function TypeBadge({ name }: { name: string }) {
  return (
    <View className="self-start px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800">
      <Text className="text-[10px] text-stone-600 dark:text-stone-400">{name}</Text>
    </View>
  );
}
