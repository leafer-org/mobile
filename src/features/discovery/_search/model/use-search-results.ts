import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { PixelRatio } from 'react-native';

import { useApiFetchClient } from '@/kernel/api/provider';

import type { AgeGroup, ItemListView } from '../../domain/types';

type Args = {
  query: string;
  cityId: string;
  ageGroup: AgeGroup;
  priceMin?: number;
  priceMax?: number;
};

export function useSearchResults(args: Args) {
  const fetchClient = useApiFetchClient();
  const dpr = PixelRatio.get();
  const trimmed = args.query.trim();
  const enabled = trimmed.length > 0 && args.cityId.length > 0;

  const query = useInfiniteQuery({
    enabled,
    queryKey: [
      'search-results',
      trimmed,
      args.cityId,
      args.ageGroup,
      args.priceMin,
      args.priceMax,
    ],
    queryFn: async ({ pageParam }) => {
      const queryParams: Record<string, unknown> = {
        query: trimmed,
        cityId: args.cityId,
        ageGroup: args.ageGroup,
        limit: 20,
      };
      if (args.priceMin !== undefined) queryParams.priceMin = args.priceMin;
      if (args.priceMax !== undefined) queryParams.priceMax = args.priceMax;
      if (pageParam) queryParams.cursor = pageParam;
      const res = await fetchClient.GET('/search', {
        params: {
          query: queryParams as never,
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
    total: query.data?.pages[0]?.total ?? 0,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isRefreshing: query.isRefetching,
    handleEndReached,
    handleRefresh,
  };
}
