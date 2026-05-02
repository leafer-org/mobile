import type { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';

import type { ItemListView } from '../../domain/types';
import { GRID_GAP, HORIZONTAL_PADDING } from '../../ui/grid';

type Props = {
  items: ItemListView[];
  isLoading: boolean;
  renderItem: (item: ItemListView) => ReactNode;
};

export function FeedPreviewLayout({ items, isLoading, renderItem }: Props) {
  if (isLoading) {
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color={'#a8a29e'} />
      </View>
    );
  }

  if (items.length === 0) return null;

  return (
    <View className="pt-4">
      <View
        className="flex-row flex-wrap"
        style={{ paddingHorizontal: HORIZONTAL_PADDING, gap: GRID_GAP }}
      >
        {items.map((item) => renderItem(item))}
      </View>
    </View>
  );
}
