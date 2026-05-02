import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';

export function useCategories(parentCategoryId?: string) {
  const fetchClient = useApiFetchClient();

  return useQuery({
    queryKey: ['categories', parentCategoryId ?? 'root'],
    queryFn: async () => {
      const res = await fetchClient.GET('/categories', {
        params: {
          query: parentCategoryId ? { parentCategoryId } : {},
        },
      });
      return res.data!;
    },
  });
}
