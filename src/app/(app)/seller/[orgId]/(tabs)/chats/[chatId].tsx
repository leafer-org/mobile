import { router, useLocalSearchParams } from 'expo-router';

import { EmployeeChatScreen, useCurrentOrganizationId } from '@/features/organization';

export default function SellerOrgChatRoute() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const currentOrgId = useCurrentOrganizationId();

  return (
    <EmployeeChatScreen
      organizationId={currentOrgId}
      chatId={chatId}
      onBack={() => router.back()}
    />
  );
}
