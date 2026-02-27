import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';

export function useMe() {
  const fetchClient = useApiFetchClient();

  return useQuery({
    queryKey: ['me'],
    queryFn: () =>
      fetchClient.GET('/me').then((res) => {
        if (res.error) throw res.error;
        return res.data;
      }),
  });
}

export function useMeSuspense() {
  const fetchClient = useApiFetchClient();

  return useSuspenseQuery({
    queryKey: ['me'],
    queryFn: () =>
      fetchClient.GET('/me').then((res) => {
        if (res.error) throw res.error;
        return res.data;
      }),
  }).data;
}
