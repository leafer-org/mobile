import { Stack } from 'expo-router';

import { ThemeProvider } from '@/kernel/theme/theme-provider';
import '../global.css';

import { organizationProfileViews } from '@/features/organization-detail';
import { PublicApiProvider } from '@/kernel/api';
import { OrganizationProfileViewsProvider } from '@/kernel/organization-profile';
import { useLogoutApiListener } from '@/kernel/session/session';

function EffectRegistry() {
  useLogoutApiListener();
  return null;
}

export default function RootLayout() {
  return (
    <PublicApiProvider>
      <ThemeProvider>
        <OrganizationProfileViewsProvider views={organizationProfileViews}>
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
        </OrganizationProfileViewsProvider>
      </ThemeProvider>
    </PublicApiProvider>
  );
}
