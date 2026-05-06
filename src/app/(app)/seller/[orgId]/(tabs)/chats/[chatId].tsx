import { router, useLocalSearchParams } from 'expo-router';

import { EmployeeChatScreen } from '@/features/organization';

export default function SellerOrgChatRoute() {
  const { orgId, chatId } = useLocalSearchParams<{ orgId: string; chatId: string }>();
  return (
    <EmployeeChatScreen
      organizationId={orgId ?? ''}
      chatId={chatId ?? ''}
      onBack={() => router.back()}
    />
  );
}
