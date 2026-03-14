import { Stack } from 'expo-router';

import { ThemeProvider } from '@/kernel/theme/theme-provider';
import '../global.css';

import { PublicApiProvider } from '@/kernel/api';
import { useLogoutApiListener } from '@/kernel/session/session';

function EffectRegistry() {
  useLogoutApiListener();
  return null;
}

export default function RootLayout() {
  return (
    <PublicApiProvider>
      <ThemeProvider>
        <EffectRegistry />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="error" />
        </Stack>
      </ThemeProvider>
    </PublicApiProvider>
  );
}
