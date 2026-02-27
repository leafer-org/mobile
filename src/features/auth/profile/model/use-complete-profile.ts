import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MediaRecord } from './use-upload-media';
import { useApiFetchClient } from '@/kernel/api/provider';

export function useCompleteProfileForm({
  fullName,
  avatar,
  onSuccess,
}: {
  fullName?: string;
  avatar?: MediaRecord;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const fetchClient = useApiFetchClient();

  const completeProfileMutation = useMutation({
    mutationFn: async (args: { fullName?: string; avatar?: MediaRecord }) => {
      const { data, error } = await fetchClient.POST('/auth/complete-profile', {
        body: {
          avatarMedia: args.avatar,
          fullName: args.fullName,
        },
      });
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      onSuccess();
    },
    onError: (error) => {
      console.error('Failed to complete profile:', error);
    },
  });

  return {
    submit: () => completeProfileMutation.mutate({ fullName, avatar }),
    isSubmitting: completeProfileMutation.isPending,
    error: completeProfileMutation.error,
    canSubmit: Boolean(fullName) && fullName.trim().length > 0,
  };
}
