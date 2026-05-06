import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';

export const organizationQueryKey = (id: string) => ['organizations', 'detail', id] as const;

export function useOrganization(id: string) {
  const fetchClient = useApiFetchClient();

  return useQuery({
    enabled: id.length > 0,
    queryKey: organizationQueryKey(id),
    queryFn: () =>
      fetchClient.GET('/organizations/{id}', { params: { path: { id } } }).then((res) => {
        if (res.error) throw res.error;
        return res.data;
      }),
  });
}
