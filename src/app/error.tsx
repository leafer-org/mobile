import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/kernel/ui/button';
import { Text } from '@/kernel/ui/text';

export default function ErrorScreen() {
  const router = useRouter();

  const handleRetry = () => {
    router.push('/');
  };

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-stone-900 px-6">
      <View className="items-center gap-6">
        <View className="items-center gap-2">
          <Text variant="h1" className="text-center">
            😔
          </Text>
          <Text variant="h2" className="text-center">
            Что-то случилось
          </Text>
          <Text variant="body" className="text-center text-stone-600 dark:text-stone-400">
            Произошла непредвиденная ошибка
          </Text>
        </View>

        <Button variant="primary" onPress={handleRetry}>
          Попробовать снова
        </Button>
      </View>
    </View>
  );
}
