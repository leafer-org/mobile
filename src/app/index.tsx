import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { Spinner } from '@/kernel/ui/spinner';
import { Text } from '@/kernel/ui/text';
import { useMe } from '@/support/user';

export default function Index() {
  const meQuery = useMe();

  if (meQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900 px-6 gap-4">
        <Spinner size="large" />
        <Text variant="body">Загрузка...</Text>
      </View>
    );
  }


  if (meQuery.isSuccess) {
    return <Redirect href="/(app)" />;
  }

  if (meQuery.error) {
    return <Redirect href="/(auth)/phone" />;
  }

  return <Redirect href="/error" />;
}
