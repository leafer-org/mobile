import { useCallback, useRef, useState, type ReactElement, type ReactNode } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  View,
  type ViewToken,
} from 'react-native';

import { Text } from '@/kernel/ui/text';

import type { ItemListView } from '../domain/types';
import { GRID_GAP, HORIZONTAL_PADDING, NUM_COLUMNS } from './grid';
import { ItemListSkeleton } from './item-card-skeleton';

type Props = {
  items: ItemListView[];
  renderItem: (item: ItemListView, ctx: { isVisible: boolean }) => ReactNode;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onEndReached: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  ListHeaderComponent?: ReactElement;
};

export function ItemList({
  items,
  renderItem,
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
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        {ListHeaderComponent}
        <ItemListSkeleton />
      </ScrollView>
    );
  }

  if (items.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={'#a8a29e'} />
        }
      >
        {ListHeaderComponent}
        <View
          testID="item-list-empty"
          className="flex-1 items-center justify-center py-20 px-6"
        >
          <Text variant="h3" className="text-center">
            Пока нет услуг
          </Text>
          <Text variant="caption" className="text-center mt-2">
            Попробуйте изменить город или возрастную группу
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.itemId}
      numColumns={NUM_COLUMNS}
      columnWrapperStyle={{ gap: GRID_GAP }}
      renderItem={({ item }) => (
        <>{renderItem(item, { isVisible: visibleItemIds.has(item.itemId) })}</>
      )}
      onEndReached={hasNextPage ? onEndReached : undefined}
      onEndReachedThreshold={0.5}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfigRef.current}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={'#a8a29e'} />
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <ActivityIndicator size="small" color={'#a8a29e'} />
          </View>
        ) : null
      }
      windowSize={5}
      maxToRenderPerBatch={6}
      removeClippedSubviews
      contentContainerStyle={{
        paddingBottom: 16,
        paddingHorizontal: HORIZONTAL_PADDING,
      }}
    />
  );
}
