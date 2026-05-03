import { useMutation, useQueryClient } from '@tanstack/react-query';

import { organizationItemsQueryKey } from './use-organization-items';
import type { PublicApiComponents } from '@/kernel/api';
import { useApiFetchClient } from '@/kernel/api/provider';

type ItemWidgetInput = PublicApiComponents['schemas']['ItemWidgetInput'];

export function useCreateItem({
  orgId,
  onSuccess,
}: {
  orgId: string;
  onSuccess?: (itemId: string) => void;
}) {
  const fetchClient = useApiFetchClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { typeId: string; widgets: ItemWidgetInput[] }) => {
      const res = await fetchClient.POST('/organizations/{orgId}/items', {
        params: { path: { orgId } },
        body: { typeId: input.typeId, widgets: input.widgets },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: organizationItemsQueryKey(orgId) });
      onSuccess?.(data.itemId);
    },
  });
}
