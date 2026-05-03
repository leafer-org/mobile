import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';

export const myOrganizationsQueryKey = ['organizations', 'my'] as const;

export function useMyOrganizations() {
  const fetchClient = useApiFetchClient();

  return useQuery({
    queryKey: myOrganizationsQueryKey,
    queryFn: () =>
      fetchClient.GET('/organizations/my').then((res) => {
        if (res.error) throw res.error;
        return res.data;
      }),
  });
}
