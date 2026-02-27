import { Stack } from 'expo-router';
import { Suspense } from 'react';
import { View } from 'react-native';

import { Spinner } from '@/kernel/ui/spinner';
import { Text } from '@/kernel/ui/text';

export default function AppLayout() {
  console.log('AppLayout');
  return (
    <Suspense
      fallback={
        <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900 px-6 gap-4">
          <Spinner size="large" />
          <Text variant="body">Загрузка...</Text>
        </View>
      }
    >
      <Stack
        screenOptions={{
          headerShown: true,
          animation: 'slide_from_right',
        }}
      />
    </Suspense>
  );
}
