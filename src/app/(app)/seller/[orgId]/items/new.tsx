import { router, useLocalSearchParams } from 'expo-router';

import { CreateItemScreen } from '@/features/organization';

export default function CreateItemRoute() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();

  if (!orgId) return null;

  return (
    <CreateItemScreen
      orgId={orgId}
      onCreated={() => {
        router.back();
      }}
    />
  );
}
