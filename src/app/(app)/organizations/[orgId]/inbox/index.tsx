import { useLocalSearchParams } from 'expo-router';

import { EmployeeInboxScreen } from '@/features/organization';

export default function EmployeeInboxRoute() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();
  return <EmployeeInboxScreen organizationId={orgId ?? ''} />;
}
