import { useMutation } from '@tanstack/react-query';

import { otpStore } from './otp-store';
import { usePublicFetchClient } from '@/kernel/api/provider';
import { PathsAuthRequestOtpPostRequestBodyApplicationJsonChannel } from '@/kernel/api/schema';
import { ApiError, isApiErrorWithStatus } from '@/lib/api/error';

export function useRequestOtp(params?: { onSuccess?: (phone: string) => void }) {
  const dispatchOtpAction = otpStore.useDispatch();
  const publicClient = usePublicFetchClient();

  const requestOtpMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      const { data, error, response } = await publicClient.POST('/auth/request-otp', {
        body: {
          phoneNumber,
          channel: PathsAuthRequestOtpPostRequestBodyApplicationJsonChannel.sms,
        },
      });
      if (error) {
        throw new ApiError(response.status, error);
      }
      return data;
    },
  });

  const handleSubmit = async (phone: string) => {
    try {
      const result = await requestOtpMutation.mutateAsync(phone);

      dispatchOtpAction({ type: 'phoneSent', nextRetrySec: result.nextRetrySec ?? 60 });

      params?.onSuccess?.(phone);
    } catch (error) {
      const retryAfterSec = isApiErrorWithStatus(error, 429)
        ? (error.data as { retryAfterSec: number }).retryAfterSec
        : undefined;

      dispatchOtpAction({ type: 'phoneRequestFailed', retryAfterSec });
    }
  };

  const errorMessage = requestOtpMutation.error
    ? requestOtpMutation.error instanceof ApiError
      ? (requestOtpMutation.error.data as { message?: string })?.message
      : 'Ошибка при запросе OTP'
    : undefined;

  return {
    handleSubmit,
    loading: requestOtpMutation.isPending,
    errorMessage,
  };
}
