import { type Href, router } from 'expo-router';

import { CreateOrganizationScreen } from '@/features/organization';

export default function CreateOrganizationRoute() {
  return (
    <CreateOrganizationScreen
      onBack={() => router.back()}
      onCreated={() => {
        router.replace('/seller' as Href);
      }}
    />
  );
}
