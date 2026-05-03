import { type Href, router } from 'expo-router';

import { OrganizationsPickerScreen } from '@/features/organization';
import { useSelectedOrg } from '@/features/organization/model/use-selected-org';

export default function OrganizationsPickerRoute() {
  const { select } = useSelectedOrg();

  return (
    <OrganizationsPickerScreen
      onSelectOrganization={(orgId) => {
        select(orgId);
        router.replace(`/seller/${orgId}` as Href);
      }}
      onCreateNew={() => {
        router.push('/onboarding/create-organization');
      }}
    />
  );
}
