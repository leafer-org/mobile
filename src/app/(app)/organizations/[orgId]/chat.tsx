import { router, useLocalSearchParams } from 'expo-router';

import { ClientChatScreen } from '@/features/client-chat';

export default function OrgChatRoute() {
  const { orgId, contextItemId, contextItemTitle, organizationName } = useLocalSearchParams<{
    orgId: string;
    contextItemId?: string;
    contextItemTitle?: string;
    organizationName?: string;
  }>();
  return (
    <ClientChatScreen
      organizationId={orgId ?? ''}
      contextItemId={contextItemId ?? null}
      contextItemTitle={contextItemTitle ?? null}
      organizationName={organizationName ?? null}
      onBack={() => router.back()}
    />
  );
}
