import { ScrollView, View } from 'react-native';

import { useMyOrganizations } from '../model/use-my-organizations';
import { OrganizationListItem } from '../ui/organization-list-item';
import { Button } from '@/kernel/ui/button';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Spinner } from '@/kernel/ui/spinner';
import { Text } from '@/kernel/ui/text';

export function OrganizationsPickerScreen({
  onSelectOrganization,
  onCreateNew,
}: {
  onSelectOrganization: (organizationId: string) => void;
  onCreateNew: () => void;
}) {
  const { data, isPending, error } = useMyOrganizations();

  return (
    <ScreenLayout>
      <View className="gap-4 flex-1">
        <Text variant="h1">Мои организации</Text>

        {isPending && (
          <View className="flex-1 items-center justify-center">
            <Spinner size="large" />
          </View>
        )}

        {error && (
          <Text variant="body" color="error">
            Не удалось загрузить список организаций
          </Text>
        )}

        {data && data.organizations.length === 0 && (
          <View className="flex-1 items-center justify-center gap-3">
            <Text variant="body" color="secondary">
              У вас ещё нет организаций
            </Text>
            <Button variant="primary" onPress={onCreateNew}>
              Создать организацию
            </Button>
          </View>
        )}

        {data && data.organizations.length > 0 && (
          <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
            {data.organizations.map((org) => (
              <OrganizationListItem
                key={org.id}
                name={org.name}
                description={org.description}
                avatarUrl={org.avatarUrl}
                isOwner={org.isOwner}
                isPublished={org.isPublished}
                draftStatus={org.draftStatus}
                onPress={() => onSelectOrganization(org.id)}
              />
            ))}
            <Button variant="outline" onPress={onCreateNew}>
              + Новая организация
            </Button>
          </ScrollView>
        )}
      </View>
    </ScreenLayout>
  );
}
