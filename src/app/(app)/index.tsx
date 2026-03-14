import { useRouter } from 'expo-router';
import { Linking, ScrollView, View } from 'react-native';

import { tokensStore } from '@/kernel/session';
import { Avatar } from '@/kernel/ui/avatar';
import { Button } from '@/kernel/ui/button';
import { Text } from '@/kernel/ui/text';
import { useMeSuspense } from '@/support/user';

export default function HomeScreen() {
  const router = useRouter();

  const openPlanDocument = async () => {
    await Linking.openURL('https://github.com/leafer-org/main/blob/main/work/1-idp.md');
  };

  const me = useMeSuspense();

  const initials =
    me.fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-1 items-center justify-center p-6 gap-6">
        <View className="items-center gap-4">
          <Avatar size="xl" avatar={me.avatar} initials={initials} />
          <View className="items-center gap-2">
            <Text variant="h1">🎉 Добро пожаловать!</Text>
            {me.fullName && <Text variant="h3">{me.fullName}</Text>}
            <Text variant="body" className="text-center">
              Вы успешно авторизовались в приложении Leafer
            </Text>
          </View>
        </View>

        <View className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl gap-4">
          <Text variant="h3">Что дальше?</Text>
          <View className="gap-2">
            <Text variant="body">• ✅ UIKit компоненты готовы</Text>
            <Text variant="body">• ✅ Экраны авторизации созданы</Text>
            <Text variant="body">• ✅ Тёмная тема</Text>
            <Text variant="body">• ⏳ Интеграция с IDP сервисом</Text>
            <Text variant="body">• ⏳ Управление сессиями</Text>
            <Text variant="body">• ⏳ Полный flow авторизации</Text>
          </View>
        </View>
        <Text>{JSON.stringify(me, null, 2)}</Text>

        <View className="w-full gap-3">
          <Button variant="primary" onPress={() => router.push('/(app)/profile')}>
            Редактировать профиль
          </Button>
          <Button variant="primary" onPress={openPlanDocument}>
            Открыть план разработки
          </Button>
          <Button variant="primary" onPress={() => tokensStore.clear()}>
            {' Очистить сесию'}
          </Button>
          <Text variant="caption" className="text-center">
            Этот экран - временная заглушка.{'\n'}
            Основной функционал будет добавлен позже.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
