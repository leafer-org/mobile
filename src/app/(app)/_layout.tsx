import { Stack } from 'expo-router';
import { Suspense } from 'react';
import { useColorScheme, View } from 'react-native';

import { RealtimeProvider } from '@/kernel/realtime';
import { Spinner } from '@/kernel/ui/spinner';
import { Text } from '@/kernel/ui/text';

function SuspenseFallback() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-stone-900 px-6 gap-4">
      <Spinner size="large" />
      <Text variant="body">Загрузка...</Text>
    </View>
  );
}

export default function AppLayout() {
  const isDark = useColorScheme() === 'dark';

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <RealtimeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDark ? '#1c1917' : '#ffffff' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="seller" />
        <Stack.Screen
          name="onboarding"
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="items/[itemId]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="organizations/[orgId]/index"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="organizations/[orgId]/chat"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="organizations/[orgId]/inbox/index"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="organizations/[orgId]/inbox/[chatId]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="chats/index"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="chats/[chatId]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
      </RealtimeProvider>
    </Suspense>
  );
}
