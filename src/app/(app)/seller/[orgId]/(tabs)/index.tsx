import { type Href, router, useLocalSearchParams } from 'expo-router';

import { OrganizationItemsScreen } from '@/features/organization';

export default function SellerOrgItemsRoute() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();

  if (!orgId) return null;

  return (
    <OrganizationItemsScreen
      orgId={orgId}
      onCreateItem={() => {
        router.push(`/seller/${orgId}/items/new` as Href);
      }}
    />
  );
}
