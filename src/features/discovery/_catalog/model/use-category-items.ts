import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { PixelRatio } from 'react-native';

import { useApiFetchClient } from '@/kernel/api/provider';

import type { ItemListView } from '../../domain/types';
import type { CategoryItemsFilters } from './use-category-filters';

export function useCategoryItems(
  categoryId: string,
  filters: CategoryItemsFilters,
) {
  const fetchClient = useApiFetchClient();
  const dpr = PixelRatio.get();

  const cleanQuery: Record<string, unknown> = { limit: 20 };
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') {
      cleanQuery[key] = value;
    }
  }

  const query = useInfiniteQuery({
    enabled: categoryId.length > 0,
    queryKey: ['category-items', categoryId, filters],
    queryFn: async ({ pageParam }) => {
      const res = await fetchClient.GET('/categories/{id}/items', {
        params: {
          path: { id: categoryId },
          query: {
            cursor: pageParam ?? undefined,
            ...cleanQuery,
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

  const itemIds = useMemo(() => items.map((i) => i.itemId), [items]);

  const handleEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  const handleRefresh = useCallback(() => {
    query.refetch();
  }, [query.refetch]);

  return {
    items,
    itemIds,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isRefreshing: query.isRefetching,
    handleEndReached,
    handleRefresh,
  };
}
