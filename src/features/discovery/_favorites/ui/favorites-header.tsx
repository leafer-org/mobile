import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/kernel/ui/text';

type Props = {
  searchSlot: ReactNode;
};

export function FavoritesHeader({ searchSlot }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 px-4 pb-3 gap-3"
      style={{ paddingTop: insets.top + 8 }}
    >
      <Text variant="h3">Избранное</Text>
      {searchSlot}
    </View>
  );
}
