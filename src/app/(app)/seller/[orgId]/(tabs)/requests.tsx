import { View } from 'react-native';

import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Text } from '@/kernel/ui/text';

export default function SellerOrgRequestsRoute() {
  return (
    <ScreenLayout>
      <View className="flex-1 items-center justify-center gap-2">
        <Text variant="h2">Заявки</Text>
        <Text variant="body" color="secondary">
          Здесь появятся обращения клиентов
        </Text>
      </View>
    </ScreenLayout>
  );
}
