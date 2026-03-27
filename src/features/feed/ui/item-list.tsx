import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
  type ViewToken,
} from 'react-native';

import { ItemCard } from '../compose/item-card';
import type { ItemListView } from '../domain/types';
import { GRID_GAP, HORIZONTAL_PADDING, NUM_COLUMNS } from './item-card-layout';
import { ItemListSkeleton } from './item-card-skeleton';
import { Text } from '@/kernel/ui/text';

type Props = {
  items: ItemListView[];
  likedItemIds?: Set<string>;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onEndReached: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  ListHeaderComponent?: React.ReactElement;
};

export function ItemList({
  items,
  likedItemIds,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onEndReached,
  onRefresh,
  isRefreshing,
  ListHeaderComponent,
}: Props) {
  const [visibleItemIds, setVisibleItemIds] = useState<Set<string>>(new Set());

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      setVisibleItemIds(
        new Set(viewableItems.map((v) => (v.item as ItemListView).itemId)),
      );
    },
    [],
  );

  const viewabilityConfigRef = useRef({ itemVisiblePercentThreshold: 50 });

  if (isLoading) {
    return <ItemListSkeleton />;
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20 px-6">
        <Text variant="h3" className="text-center">
          Пока нет услуг
        </Text>
        <Text variant="caption" className="text-center mt-2">
          Попробуйте изменить город или возрастную группу
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.itemId}
      numColumns={NUM_COLUMNS}
      columnWrapperStyle={{ gap: GRID_GAP }}
      renderItem={({ item }) => (
        <ItemCard item={item} isVisible={visibleItemIds.has(item.itemId)} isLiked={likedItemIds?.has(item.itemId) ?? false} />
      )}
      onEndReached={hasNextPage ? onEndReached : undefined}
      onEndReachedThreshold={0.5}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfigRef.current}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#0d9488" />
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <ActivityIndicator size="small" color="#0d9488" />
          </View>
        ) : null
      }
      windowSize={5}
      maxToRenderPerBatch={6}
      removeClippedSubviews
      contentContainerStyle={{
        paddingTop: 8,
        paddingBottom: 16,
        paddingHorizontal: HORIZONTAL_PADDING,
      }}
    />
  );
}
