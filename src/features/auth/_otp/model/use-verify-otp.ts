import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useRegistrationDispatch } from '../../model/registration-store';
import { usePublicFetchClient } from '@/kernel/api/provider';
import { tokensStore } from '@/kernel/session';
import { ApiError } from '@/lib/api/error';

export type VerifyOtpResult = 'authenticated' | 'new_registration';

interface VerifyOtpParams {
  phoneNumber: string;
  code: string;
}

export function useVerifyOtp(params?: { onSuccess?: (result: VerifyOtpResult) => void }) {
  const queryClient = useQueryClient();
  const publicClient = usePublicFetchClient();
  const registrationDispatch = useRegistrationDispatch();

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ phoneNumber, code }: VerifyOtpParams) => {
      const { data, error, response } = await publicClient.POST('/auth/verify-otp', {
        body: { phoneNumber, code },
      });

      if (error) {
        throw new ApiError(response.status, error);
      }

      if ('accessToken' in data) {
        await tokensStore.set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        queryClient.removeQueries();
        return 'authenticated' as const;
      }

      registrationDispatch({
        type: 'otpVerified',
        registrationSessionId: data.registrationSessionId,
      });
      return 'new_registration' as const;
    },
  });

  const handleSubmit = async (phoneNumber: string, code: string) => {
    const result = await verifyOtpMutation.mutateAsync({ phoneNumber, code });
    params?.onSuccess?.(result);
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
