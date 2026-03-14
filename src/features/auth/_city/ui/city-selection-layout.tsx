import type { ReactNode } from 'react';
import { View } from 'react-native';

import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Text } from '@/kernel/ui/text';

export function CitySelectionLayout({
  search,
  list,
  actions,
}: {
  search: ReactNode;
  list: ReactNode;
  actions: ReactNode;
}) {
  return (
    <ScreenLayout>
      <View className="flex-1">
        <Text variant="h2" className="mb-2">
          Выберите город
        </Text>
        <Text variant="caption" className="mb-4">
          Мы покажем актуальные предложения рядом с вами
        </Text>

        <View className="mb-3">{search}</View>

        <View className="flex-1">{list}</View>

        <View className="pb-6 pt-3">{actions}</View>
      </View>
    </ScreenLayout>
  );
}
