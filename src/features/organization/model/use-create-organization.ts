import { useMutation, useQueryClient } from '@tanstack/react-query';

import { myOrganizationsQueryKey } from './use-my-organizations';
import { useApiFetchClient } from '@/kernel/api/provider';

type CreateOrganizationInput = {
  name: string;
  description: string;
};

export function useCreateOrganization({
  onSuccess,
}: {
  onSuccess?: (organizationId: string) => void;
} = {}) {
  const fetchClient = useApiFetchClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrganizationInput) => {
      const res = await fetchClient.POST('/organizations', {
        body: { name: input.name, description: input.description },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: myOrganizationsQueryKey });
      onSuccess?.(data.id);
    },
  });
}
