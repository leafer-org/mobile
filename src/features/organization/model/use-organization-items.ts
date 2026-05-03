import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';

export const organizationItemsQueryKey = (orgId: string) =>
  ['organizations', orgId, 'items'] as const;

export function useOrganizationItems(orgId: string) {
  const fetchClient = useApiFetchClient();

  return useQuery({
    queryKey: organizationItemsQueryKey(orgId),
    queryFn: () =>
      fetchClient
        .GET('/organizations/{orgId}/items', { params: { path: { orgId } } })
        .then((res) => {
          if (res.error) throw res.error;
          return res.data;
        }),
  });
}
