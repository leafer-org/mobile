import { ScrollView, View } from 'react-native';

import { useMyOrganizations } from '../model/use-my-organizations';
import { useOrganizationItems } from '../model/use-organization-items';
import { ItemListRow } from '../ui/item-list-row';
import { Button } from '@/kernel/ui/button';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Spinner } from '@/kernel/ui/spinner';
import { Text } from '@/kernel/ui/text';

export function OrganizationItemsScreen({
  orgId,
  onCreateItem,
}: {
  orgId: string;
  onCreateItem: () => void;
}) {
  const { data: orgsData } = useMyOrganizations();
  const { data, isPending, error } = useOrganizationItems(orgId);

  const org = orgsData?.organizations.find((o) => o.id === orgId);

  return (
    <ScreenLayout>
      <View className="gap-4 flex-1">
        <View className="gap-1">
          {org && <Text variant="h1">{org.name}</Text>}
          <Text variant="caption" color="secondary">
            Услуги и товары
          </Text>
        </View>

        {isPending && (
          <View className="flex-1 items-center justify-center">
            <Spinner size="large" />
          </View>
        )}

        {error && (
          <Text variant="body" color="error">
            Не удалось загрузить услуги
          </Text>
        )}

        {data && data.items.length === 0 && (
          <View className="flex-1 items-center justify-center gap-3">
            <Text variant="body" color="secondary">
              Пока нет ни одной услуги
            </Text>
            <Button variant="primary" onPress={onCreateItem}>
              Создать первую услугу
            </Button>
          </View>
        )}

        {data && data.items.length > 0 && (
          <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
            {data.items.map((item) => (
              <ItemListRow
                key={item.itemId}
                widgets={item.widgets ?? []}
                draftStatus={item.draftStatus as 'draft' | 'moderation-request' | 'rejected' | null}
                hasPublication={item.hasPublication ?? false}
              />
            ))}
            <Button variant="outline" onPress={onCreateItem}>
              + Новая услуга
            </Button>
          </ScrollView>
        )}
      </View>
    </ScreenLayout>
  );
}
