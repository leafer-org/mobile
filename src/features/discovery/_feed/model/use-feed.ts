import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { PixelRatio } from 'react-native';

import { useApiFetchClient } from '@/kernel/api/provider';
import { PathsFeedGetParametersQueryAgeGroup } from '@/kernel/api/schema';

import type { AgeGroup, ItemListView } from '../../domain/types';

export function useFeed(cityId: string, ageGroup: AgeGroup) {
  const fetchClient = useApiFetchClient();
  const dpr = PixelRatio.get();

  const query = useInfiniteQuery({
    enabled: cityId.length > 0,
    queryKey: ['feed', { cityId, ageGroup }],
    queryFn: async ({ pageParam }) => {
      const res = await fetchClient.GET('/feed', {
        params: {
          query: {
            cityId,
            ageGroup: ageGroup as PathsFeedGetParametersQueryAgeGroup,
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
