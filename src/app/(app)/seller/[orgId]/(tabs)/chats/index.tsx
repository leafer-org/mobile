import { type Href, router, useLocalSearchParams } from 'expo-router';

import { EmployeeInboxScreen, useCurrentOrganizationId } from '@/features/organization';

export default function SellerOrgChatsListRoute() {

  const currentOrgId = useCurrentOrganizationId();

  return (
    <EmployeeInboxScreen
      organizationId={currentOrgId}
      onChatPress={(chatId) =>
        router.push(`/seller/${currentOrgId}/chats/${chatId}` as Href)
      }
    />
  );
}
