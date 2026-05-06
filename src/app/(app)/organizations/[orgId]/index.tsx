import { useLocalSearchParams } from 'expo-router';

import { OrganizationDetailScreen } from '@/features/organization-detail';

export default function OrganizationDetailRoute() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  return <OrganizationDetailScreen orgId={orgId ?? ''} />;
}
