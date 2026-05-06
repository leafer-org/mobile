import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { EditTeamMemberScreen } from '@/features/organization/compose/edit-team-member-screen';
import {
  type EditInfoFormState,
  infoDraftToFormState,
  useEditInfoForm,
} from '@/features/organization/model/edit-info-form';
import { useOrganization } from '@/features/organization/model/use-organization';
import { ScreenLayout } from '@/kernel/ui/screen-layout';
import { Text } from '@/kernel/ui/text';

export default function EditTeamMemberRoute() {
  const { orgId, memberIndex } = useLocalSearchParams<{
    orgId: string;
    memberIndex: string;
  }>();
  const id = orgId ?? '';
  const index = Number(memberIndex);

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

  return <Inner orgId={id} initial={initial} memberIndex={index} />;
}

function Inner({
  orgId,
  initial,
  memberIndex,
}: {
  orgId: string;
  initial: EditInfoFormState;
  memberIndex: number;
}) {
  useEditInfoForm(orgId, initial);

  return (
    <EditTeamMemberScreen
      organizationId={orgId}
      memberIndex={Number.isFinite(memberIndex) ? memberIndex : -1}
      onBack={() => router.back()}
      onRemoved={() => router.back()}
    />
  );
}
