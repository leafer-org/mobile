import { useInfiniteQuery } from '@tanstack/react-query';
import { PixelRatio } from 'react-native';

import { useApiFetchClient } from '@/kernel/api/provider';
import type { CategoryItemsFilters } from './use-category-filters';

export function useCategoryItems(
  categoryId: string,
  filters: CategoryItemsFilters,
) {
  const fetchClient = useApiFetchClient();
  const dpr = PixelRatio.get();

  // Убираем пустые строки и undefined — API не должен получать пустые значения
  const { childCategoryId: _, ...apiFilters } = filters;
  const cleanQuery: Record<string, unknown> = { limit: 20 };
  for (const [key, value] of Object.entries(apiFilters)) {
    if (value !== undefined && value !== '') {
      cleanQuery[key] = value;
    }
  }

  return useInfiniteQuery({
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
}
