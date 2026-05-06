import { type Href, router, useLocalSearchParams } from 'expo-router';

import { OrganizationManagementScreen } from '@/features/organization';
import { useSelectedOrg } from '@/features/organization/model/use-selected-org';

export default function SellerOrgManagementRoute() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  const { select } = useSelectedOrg();

  return (
    <OrganizationManagementScreen
      orgId={orgId ?? ''}
      onEdit={() => router.push(`/seller/${orgId}/edit` as Href)}
      onSelectOrg={(id) => {
        select(id);
        router.replace(`/seller/${id}` as Href);
      }}
      onCreateNewOrg={() => router.push('/onboarding/create-organization')}
    />
  );
}
