import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export function ProfileSetupHeader() {
  return (
    <View className="gap-2">
      <Text variant="h1">Расскажите о себе</Text>
      <Text variant="body">Это поможет другим пользователям узнать вас</Text>
    </View>
  );
}
