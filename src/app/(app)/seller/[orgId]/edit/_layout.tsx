import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { clearEditInfoForm } from '@/features/organization/model/edit-info-form';

export default function EditLayout() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const isDark = useColorScheme() === 'dark';

  useEffect(
    () => () => {
      if (orgId) clearEditInfoForm(orgId);
    },
    [orgId],
  );

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? '#1c1917' : '#ffffff' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="team/index" />
      <Stack.Screen name="team/[memberIndex]" />
    </Stack>
  );
}
