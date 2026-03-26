import { useInfiniteQuery } from '@tanstack/react-query';
import { PixelRatio } from 'react-native';

import type { AgeGroup } from '../domain/types';
import { useApiFetchClient } from '@/kernel/api/provider';
import { PathsFeedGetParametersQueryAgeGroup } from '@/kernel/api/schema';

const AGE_GROUP_MAP: Record<AgeGroup, PathsFeedGetParametersQueryAgeGroup> = {
  adults: PathsFeedGetParametersQueryAgeGroup.adults,
  children: PathsFeedGetParametersQueryAgeGroup.children,
};

export function useFeed(cityId: string, ageGroup: AgeGroup) {
  const fetchClient = useApiFetchClient();
  const dpr = PixelRatio.get();

  return useInfiniteQuery({
    enabled: cityId.length > 0,
    queryKey: ['feed', { cityId, ageGroup }],
    queryFn: async ({ pageParam }) => {
      const res = await fetchClient.GET('/feed', {
        params: {
          query: {
            cityId,
            ageGroup: AGE_GROUP_MAP[ageGroup],
            cursor: pageParam ?? undefined,
            limit: 20,
          },
        },
        headers: { 'X-Device-DPR': String(dpr) },
      });
      return res.data!;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}
