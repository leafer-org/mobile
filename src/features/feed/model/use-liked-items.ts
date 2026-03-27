import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { PixelRatio } from 'react-native';

import { useApiFetchClient } from '@/kernel/api/provider';

export function useLikedItems(search?: string) {
  const fetchClient = useApiFetchClient();
  const dpr = PixelRatio.get();

  return useInfiniteQuery({
    placeholderData: keepPreviousData,
    queryKey: ['liked-items', { search }],
    queryFn: async ({ pageParam }) => {
      const res = await fetchClient.GET('/liked-items', {
        params: {
          query: {
            search: search || undefined,
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
}
