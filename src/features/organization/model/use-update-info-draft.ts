import { useMutation, useQueryClient } from '@tanstack/react-query';

import { myOrganizationsQueryKey } from './use-my-organizations';
import { organizationQueryKey } from './use-organization';
import type { PublicApiOperations } from '@/kernel/api';
import { useApiFetchClient } from '@/kernel/api/provider';
import { ApiError } from '@/lib/api/error';

type UpdateInfoDraftBody =
  PublicApiOperations['updateInfoDraft']['requestBody']['content']['application/json'];

export function useUpdateInfoDraft({
  organizationId,
  onSuccess,
}: {
  organizationId: string;
  onSuccess?: () => void;
}) {
  const fetchClient = useApiFetchClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateInfoDraftBody) => {
      const { data, error, response } = await fetchClient.PATCH('/organizations/{id}', {
        params: { path: { id: organizationId } },
        body,
      });
      if (error) throw new ApiError(response.status, error);
      return data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: organizationQueryKey(organizationId) }),
        queryClient.invalidateQueries({ queryKey: myOrganizationsQueryKey }),
      ]);
      onSuccess?.();
    },
  });
}
