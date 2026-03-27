import { useQuery } from '@tanstack/react-query';
import { PixelRatio } from 'react-native';

import { useApiFetchClient } from '@/kernel/api/provider';

export function useItemDetail(itemId: string) {
  const fetchClient = useApiFetchClient();
  const dpr = PixelRatio.get();

  return useQuery({
    queryKey: ['item-detail', itemId],
    queryFn: async () => {
      const res = await fetchClient.GET('/items/{itemId}', {
        params: {
          path: { itemId },
          header: { 'X-Device-DPR': dpr },
        },
      });
      if (res.error) throw res.error;
      return res.data;
    },
  });
}
