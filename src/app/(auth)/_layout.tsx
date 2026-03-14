import { Stack } from 'expo-router';

import { OtpStoreProvider } from '@/features/auth/_otp';
import { RegistrationStoreProvider } from '@/features/auth/model/registration-store';

export default function AuthLayout() {
  return (
    <OtpStoreProvider>
      <RegistrationStoreProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </RegistrationStoreProvider>
    </OtpStoreProvider>
  );
}
