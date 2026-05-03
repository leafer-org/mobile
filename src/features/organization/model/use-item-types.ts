import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';

export const itemTypesQueryKey = ['cms', 'item-types'] as const;

export function useItemTypes() {
  const fetchClient = useApiFetchClient();

  return useQuery({
    queryKey: itemTypesQueryKey,
    queryFn: () =>
      fetchClient.GET('/cms/item-types').then((res) => {
        if (res.error) throw res.error;
        return res.data;
      }),
  });
}
