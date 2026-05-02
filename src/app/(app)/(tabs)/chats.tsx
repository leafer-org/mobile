import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export default function ChatsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-stone-900">
      <Text variant="h2">Чаты</Text>
      <Text variant="caption">Скоро здесь появятся чаты</Text>
    </View>
  );
}
