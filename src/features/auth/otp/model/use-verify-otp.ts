import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usePublicFetchClient } from '@/kernel/api/provider';
import { tokensStore } from '@/kernel/session';
import { ApiError } from '@/lib/api/error';

interface VerifyOtpParams {
  phoneNumber: string;
  code: string;
}

export function useVerifyOtp(params?: { onSuccess?: (needProfile: boolean) => void }) {
  const queryClient = useQueryClient();
  const publicClient = usePublicFetchClient();

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ phoneNumber, code }: VerifyOtpParams) => {
      const { data, error, response } = await publicClient.POST('/auth/verify-otp', {
        body: {
          phoneNumber,
          code,
        },
      });

      if (error) {
        throw new ApiError(response.status, error);
      }

      const { accessToken, refreshToken, needProfile } = data;

      await tokensStore.set({
        accessToken,
        refreshToken,
      });

      queryClient.removeQueries();

      return {
        needProfile,
        accessToken,
        refreshToken,
      };
    },
  });

  const handleSubmit = async (phoneNumber: string, code: string) => {
    const result = await verifyOtpMutation.mutateAsync({
      phoneNumber,
      code,
    });

    params?.onSuccess?.(result.needProfile);
  };

  const errorMessage = verifyOtpMutation.error
    ? verifyOtpMutation.error instanceof ApiError
      ? (verifyOtpMutation.error.data as { message?: string })?.message
      : 'Ошибка при проверке кода'
    : undefined;

  return {
    handleSubmit,
    loading: verifyOtpMutation.isPending,
    errorMessage,
  };
}
