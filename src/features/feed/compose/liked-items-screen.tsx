import { useCallback, useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ItemListView } from '../domain/types';
import { useLikedItems } from '../model/use-liked-items';
import { ItemList } from '../ui/item-list';
import { Text } from '@/kernel/ui/text';
import { useDebouncedValue } from '@/lib/react/use-debounced-value';

export function LikedItemsScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isRefetching } =
    useLikedItems(debouncedSearch);

  const items: ItemListView[] = useMemo(
    () => (data?.pages.flatMap((p) => p.items) as ItemListView[]) ?? [],
    [data],
  );

  const allLiked = useMemo(() => new Set(items.map((i) => i.itemId)), [items]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <View
        className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 pb-3 gap-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Text variant="h3">Избранное</Text>
        <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 gap-2">
          <Ionicons name="search-outline" size={16} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Поиск по названию..."
            placeholderTextColor="#94a3b8"
            className="flex-1 text-sm text-slate-900 dark:text-white p-0"
            autoCorrect={false}
          />
        </View>
      </View>
      <ItemList
        items={items}
        likedItemIds={allLiked}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        onEndReached={handleEndReached}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
      />
    </View>
  );
}
