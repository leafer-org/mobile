import { Stack } from 'expo-router';
import { Suspense } from 'react';
import { useColorScheme, View } from 'react-native';

import { Spinner } from '@/kernel/ui/spinner';
import { Text } from '@/kernel/ui/text';

function SuspenseFallback() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900 px-6 gap-4">
      <Spinner size="large" />
      <Text variant="body">Загрузка...</Text>
    </View>
  );
}

export default function AppLayout() {
  const isDark = useColorScheme() === 'dark';

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDark ? '#0f172a' : '#ffffff' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="items/[itemId]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Назад',
            headerTintColor: '#0d9488',
            headerStyle: { backgroundColor: isDark ? '#0f172a' : '#ffffff' },
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </Suspense>
  );
}
