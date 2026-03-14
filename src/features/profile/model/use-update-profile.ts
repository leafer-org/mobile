import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';
import { ApiError } from '@/lib/api/error';

interface UpdateProfileParams {
  fullName: string;
  avatarId?: string;
}

export function useUpdateProfile({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const fetchClient = useApiFetchClient();

  const mutation = useMutation({
    mutationFn: async (args: UpdateProfileParams) => {
      const { data, error, response } = await fetchClient.PATCH('/me/profile', {
        body: {
          fullName: args.fullName,
        },
      });
      if (error) throw new ApiError(response.status, error);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      onSuccess();
    },
  });

  return {
    submit: (params: UpdateProfileParams) => mutation.mutate(params),
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
