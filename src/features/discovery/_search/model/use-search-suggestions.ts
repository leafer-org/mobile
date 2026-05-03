import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PixelRatio } from 'react-native';

import type { ItemListView } from '../../domain/types';
import { useApiFetchClient } from '@/kernel/api/provider';
import type { PublicApiOperations } from '@/kernel/api';

type Args = {
  query: string;
  cityId: string;
  ageGroup: 'adults' | 'children';
};

type RawResponse =
  PublicApiOperations['searchSuggestions']['responses']['200']['content']['application/json'];

export type SearchSuggestionsData = {
  categories: RawResponse['categories'];
  itemTypes: RawResponse['itemTypes'];
  organizations: RawResponse['organizations'];
  items: ItemListView[];
  popularQueries: RawResponse['popularQueries'];
};

export function useSearchSuggestions({ query, cityId, ageGroup }: Args) {
  const fetchClient = useApiFetchClient();
  const dpr = PixelRatio.get();
  const trimmed = query.trim();

  return useQuery({
    enabled: cityId.length > 0,
    queryKey: ['search-suggestions', cityId, ageGroup, trimmed],
    placeholderData: keepPreviousData,
    queryFn: async (): Promise<SearchSuggestionsData> => {
      const queryParams: Record<string, unknown> = { cityId, ageGroup };
      if (trimmed.length > 0) queryParams.query = trimmed;
      const res = await fetchClient.GET('/search/suggestions', {
        params: {
          query: queryParams as never,
          header: { 'X-Device-DPR': dpr },
        },
      });
      const data = res.data as RawResponse;
      return {
        categories: data.categories,
        itemTypes: data.itemTypes,
        organizations: data.organizations,
        items: data.items as ItemListView[],
        popularQueries: data.popularQueries,
      };
    },
  });
}
