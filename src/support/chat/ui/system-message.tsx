import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

import type { ChatMessage } from '../domain/types';
import { systemEventLabel } from '../domain/helpers';

export function SystemMessage({ message }: { message: ChatMessage }) {
  const label = systemEventLabel(message.systemEvent?.type);

  return (
    <View className="w-full items-center my-2 px-4">
      <View className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800">
        <Text className="text-xs text-stone-600 dark:text-stone-400">{label}</Text>
      </View>
    </View>
  );
}
