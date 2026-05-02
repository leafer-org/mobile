import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { PixelRatio } from 'react-native';

import { useApiFetchClient } from '@/kernel/api/provider';
import { useDebouncedValue } from '@/lib/react/use-debounced-value';

import type { ItemListView } from '../../domain/types';

export function useLikedItems() {
  const fetchClient = useApiFetchClient();
  const dpr = PixelRatio.get();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);

  const query = useInfiniteQuery({
    placeholderData: keepPreviousData,
    queryKey: ['liked-items', { search: debouncedSearch }],
    queryFn: async ({ pageParam }) => {
      const res = await fetchClient.GET('/liked-items', {
        params: {
          query: {
            search: debouncedSearch || undefined,
            cursor: pageParam ?? undefined,
            limit: 20,
          },
          header: { 'X-Device-DPR': dpr },
        },
      });
      return res.data!;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });

  const items: ItemListView[] = useMemo(
    () => (query.data?.pages.flatMap((p) => p.items) as ItemListView[]) ?? [],
    [query.data],
  );

  const allLiked = useMemo(
    () => new Set(items.map((i) => i.itemId)),
    [items],
  );

  const handleEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  const handleRefresh = useCallback(() => {
    query.refetch();
  }, [query.refetch]);

  return {
    search,
    setSearch,
    items,
    allLiked,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isRefreshing: query.isRefetching,
    handleEndReached,
    handleRefresh,
  };
}
