import { type Href, router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { EditTeamScreen } from '@/features/organization/compose/edit-team-screen';
import {
  type EditInfoFormState,
  infoDraftToFormState,
  useEditInfoForm,
} from '@/features/organization/model/edit-info-form';
import { useOrganization } from '@/features/organization/model/use-organization';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Text } from '@/kernel/ui/text';

export default function EditTeamRoute() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const id = orgId ?? '';

  const orgQuery = useOrganization(id);

  if (orgQuery.isPending || !orgQuery.data) {
    return (
      <ScreenLayout centered>
        {orgQuery.isError ? (
          <Text variant="body" color="secondary">
            Не удалось загрузить организацию
          </Text>
        ) : (
          <View className="items-center gap-2">
            <ActivityIndicator />
          </View>
        )}
      </ScreenLayout>
    );
  }

  const initial = infoDraftToFormState(orgQuery.data.infoDraft);

  return <Inner orgId={id} initial={initial} />;
}

function Inner({ orgId, initial }: { orgId: string; initial: EditInfoFormState }) {
  // Ensures store is initialized for deep-link entry points.
  useEditInfoForm(orgId, initial);

  return (
    <EditTeamScreen
      organizationId={orgId}
      onBack={() => router.back()}
      onOpenMember={(index) => router.push(`/seller/${orgId}/edit/team/${index}` as Href)}
    />
  );
}
