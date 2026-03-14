import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usePublicFetchClient } from '@/kernel/api/provider';
import type { components } from '@/kernel/api/schema';
import { tokensStore } from '@/kernel/session';
import { ApiError } from '@/lib/api/error';

type LinkMediaData = components['schemas']['LinkMediaData'];

interface CompleteProfileParams {
  registrationSessionId: string;
  cityId: string;
  lat?: number;
  lng?: number;
  fullName?: string;
  avatarMedia?: LinkMediaData;
}

export function useCompleteProfileForm({
  registrationSessionId,
  cityId,
  lat,
  lng,
  fullName,
  avatarMedia,
  onSuccess,
}: {
  registrationSessionId: string;
  cityId: string;
  lat?: number;
  lng?: number;
  fullName?: string;
  avatarMedia?: LinkMediaData;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const publicClient = usePublicFetchClient();

  const mutation = useMutation({
    mutationFn: async (args: CompleteProfileParams) => {
      const { data, error, response } = await publicClient.POST('/auth/complete-profile', {
        body: {
          registrationSessionId: args.registrationSessionId,
          cityId: args.cityId,
          lat: args.lat,
          lng: args.lng,
          fullName: args.fullName,
          avatarMedia: args.avatarMedia,
        },
      });
      if (error) throw new ApiError(response.status, error);
      return data;
    },
    onSuccess: async (data) => {
      await tokensStore.set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      queryClient.removeQueries();
      onSuccess();
    },
  });

  return {
    submit: () =>
      mutation.mutate({
        registrationSessionId,
        cityId,
        lat,
        lng,
        fullName,
        avatarMedia,
      }),
    isSubmitting: mutation.isPending,
    error: mutation.error,
    canSubmit: Boolean(fullName) && (fullName?.trim().length ?? 0) > 0,
  };
}
