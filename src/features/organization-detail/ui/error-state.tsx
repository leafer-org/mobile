import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export function ErrorState({ message }: { message: string }) {
  return (
    <View className="flex-1 items-center justify-center px-6 gap-2">
      <Text className="text-sm text-stone-500 dark:text-stone-400">{message}</Text>
    </View>
  );
}
