import { Stack } from 'expo-router';

import { OtpStoreProvider } from '@/features/auth/otp';

export default function AuthLayout() {
  console.log('AuthLayout');
  return (
    <OtpStoreProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </OtpStoreProvider>
  );
}
