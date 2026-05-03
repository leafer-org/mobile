import { type Href, router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { useMyOrganizations } from '@/features/organization';
import { useSelectedOrg } from '@/features/organization/model/use-selected-org';
import { Button } from '@/kernel/ui/button';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Text } from '@/kernel/ui/text';

export default function SellerOrgProfileRoute() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const { data } = useMyOrganizations();
  const { clear } = useSelectedOrg();

  const org = data?.organizations.find((o) => o.id === orgId);
  const hasMultipleOrgs = (data?.organizations.length ?? 0) > 1;

  return (
    <ScreenLayout>
      <View className="gap-6 flex-1">
        <View className="gap-2">
          <Text variant="h1">{org?.name ?? 'Организация'}</Text>
          {org?.description && (
            <Text variant="body" color="secondary">
              {org.description}
            </Text>
          )}
        </View>

        <View className="flex-1" />

        {hasMultipleOrgs && (
          <Button
            variant="outline"
            onPress={() => {
              clear();
              router.replace('/seller/organizations' as Href);
            }}
          >
            Сменить организацию
          </Button>
        )}
      </View>
    </ScreenLayout>
  );
}
