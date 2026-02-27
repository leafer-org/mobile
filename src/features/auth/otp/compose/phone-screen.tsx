import { useRouter } from 'expo-router';

import { useRequestOtp } from '../model/use-request-otp';
import { useRetryCountdown } from '../model/use-retry-countdown';
import { PhoneInputForm } from '../ui/phone-input-form';
import { ScreenLayout } from '@/kernel/ui/screen-layout';

export function PhoneScreen() {
  const router = useRouter();

  const { handleSubmit, loading, errorMessage } = useRequestOtp({
    onSuccess: (phone) => {
      router.push({
        pathname: '/(auth)/otp',
        params: { phone },
      });
    },
  });

  const retryAfterSec = useRetryCountdown();

  return (
    <ScreenLayout keyboardAvoiding scrollable>
      <PhoneInputForm
        onSubmit={handleSubmit}
        loading={loading}
        error={errorMessage}
        retryAfterSec={retryAfterSec}
      />
    </ScreenLayout>
  );
}
