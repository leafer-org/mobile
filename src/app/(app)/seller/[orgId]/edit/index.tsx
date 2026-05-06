import { type Href, router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { EditOrganizationInfoScreen } from '@/features/organization/compose/edit-organization-info-screen';
import {
  type EditInfoFormState,
  infoDraftToFormState,
  useEditInfoForm,
} from '@/features/organization/model/edit-info-form';
import { useMyOrganizations } from '@/features/organization/model/use-my-organizations';
import { useOrganization } from '@/features/organization/model/use-organization';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Text } from '@/kernel/ui/text';

export default function EditOrganizationRoute() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const id = orgId ?? '';

  const orgQuery = useOrganization(id);
  const myOrgs = useMyOrganizations();

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
  const listAvatarUrl = myOrgs.data?.organizations.find((o) => o.id === id)?.avatarUrl ?? null;

  return <EditScreen orgId={id} initial={initial} listAvatarUrl={listAvatarUrl} />;
}

function EditScreen({
  orgId,
  initial,
  listAvatarUrl,
}: {
  orgId: string;
  initial: EditInfoFormState;
  listAvatarUrl: string | null;
}) {
  // Initializes the module-level form store on first mount.
  useEditInfoForm(orgId, initial);

  return (
    <EditOrganizationInfoScreen
      organizationId={orgId}
      currentAvatarUrl={listAvatarUrl}
      onBack={() => router.back()}
      onOpenTeam={() => router.push(`/seller/${orgId}/edit/team` as Href)}
      onSaved={() => router.back()}
    />
  );
}
