import { type Href, router, useLocalSearchParams } from 'expo-router';

import { EmployeeInboxScreen } from '@/features/organization';

export default function SellerOrgChatsListRoute() {
  const { orgId } = useLocalSearchParams<{ orgId: string }>();

  return (
    <EmployeeInboxScreen
      organizationId={orgId ?? ''}
      onChatPress={(chatId) =>
        router.push(`/seller/${orgId}/chats/${chatId}` as Href)
      }
    />
  );
}
