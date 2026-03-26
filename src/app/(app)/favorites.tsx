import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export default function FavoritesScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900">
      <Text variant="h2">Избранное</Text>
      <Text variant="caption">Скоро здесь появятся избранные услуги</Text>
    </View>
  );
}
