import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export default function CatalogScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900">
      <Text variant="h2">Каталог</Text>
      <Text variant="caption">Скоро здесь появится каталог услуг</Text>
    </View>
  );
}
