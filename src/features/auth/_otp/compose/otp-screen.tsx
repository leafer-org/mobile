import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { useRequestOtp } from '../model/use-request-otp';
import { useRetryCountdown } from '../model/use-retry-countdown';
import { useVerifyOtp } from '../model/use-verify-otp';
import { OtpVerifyForm } from '../ui/otp-verify-form';
import { ScreenLayout } from '@/kernel/ui/screen-layout';

export function OtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const { handleSubmit, loading, errorMessage } = useVerifyOtp({
    onSuccess: (result) => {
      if (result === 'new_registration') {
        router.replace('/(auth)/city');
      } else {
        router.replace('/(app)');
      }
    },
  });

  const requestOtp = useRequestOtp();
  const retryAfterSec = useRetryCountdown();

  if (!phone) {
    return <Redirect href="/(auth)/phone" />;
  }

  return (
    <ScreenLayout keyboardAvoiding scrollable>
      <OtpVerifyForm
        phoneNumber={phone}
        onSubmit={(code) => handleSubmit(phone, code)}
        onResend={() => requestOtp.handleSubmit(phone)}
        codeLength={6}
        onBack={() => router.back()}
        loading={loading}
        error={errorMessage}
        retryAfterSec={retryAfterSec}
      />
    </ScreenLayout>
  );
}
