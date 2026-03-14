import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usePublicFetchClient } from '@/kernel/api/provider';
import { tokensStore } from '@/kernel/session';
import { ApiError } from '@/lib/api/error';

interface CompleteRegistrationParams {
  registrationSessionId: string;
  cityId: string;
  lat?: number;
  lng?: number;
}

export function useCompleteRegistration({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const publicClient = usePublicFetchClient();

  const mutation = useMutation({
    mutationFn: async (args: CompleteRegistrationParams) => {
      const { data, error, response } = await publicClient.POST('/auth/complete-profile', {
        body: {
          registrationSessionId: args.registrationSessionId,
          cityId: args.cityId,
          lat: args.lat,
          lng: args.lng,
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
    complete: (params: CompleteRegistrationParams) => mutation.mutate(params),
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
