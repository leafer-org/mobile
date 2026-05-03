import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { PixelRatio } from 'react-native';

import { useApiFetchClient } from '@/kernel/api/provider';

import type { AgeGroup, ItemListView } from '../../domain/types';
import type { CategoryItemsFilters } from './use-category-filters';

type Args = {
  cityId?: string;
  ageGroup?: AgeGroup;
} & CategoryItemsFilters;

function buildQuery(args: Args): Record<string, unknown> {
  const query: Record<string, unknown> = { limit: 20 };

  if (args.cityId) query.cityId = args.cityId;
  if (args.ageGroup) query.ageGroup = args.ageGroup;
  if (args.typeIds.length > 0) query.typeIds = args.typeIds.join(',');
  if (args.priceMin !== undefined) query.priceMin = args.priceMin;
  if (args.priceMax !== undefined) query.priceMax = args.priceMax;
  if (args.minRating !== undefined) query.minRating = args.minRating;
  if (args.attributeFilters.length > 0) {
    query.attributeFilters = JSON.stringify(args.attributeFilters);
  }
  if (args.lat !== undefined && args.lng !== undefined && args.radiusKm !== undefined) {
    query.lat = args.lat;
    query.lng = args.lng;
    query.radiusKm = args.radiusKm;
  }
  if (args.dateFrom !== undefined && args.dateTo !== undefined) {
    query.dateFrom = args.dateFrom;
    query.dateTo = args.dateTo;
  }
  if (args.scheduleDayOfWeek !== undefined) query.scheduleDayOfWeek = args.scheduleDayOfWeek;
  if (args.scheduleTimeFrom !== undefined && args.scheduleTimeTo !== undefined) {
    query.scheduleTimeFrom = args.scheduleTimeFrom;
    query.scheduleTimeTo = args.scheduleTimeTo;
  }

  return query;
}

export function useCategoryItems(categoryId: string, args: Args) {
  const fetchClient = useApiFetchClient();
  const dpr = PixelRatio.get();

  const cleanQuery = buildQuery(args);

  const query = useInfiniteQuery({
    enabled: categoryId.length > 0,
    queryKey: ['category-items', categoryId, cleanQuery],
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
