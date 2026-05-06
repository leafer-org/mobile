import { router, useLocalSearchParams } from 'expo-router';

import { ClientChatByIdScreen } from '@/features/client-chat';

export default function ChatByIdRoute() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  return <ClientChatByIdScreen chatId={chatId ?? ''} onBack={() => router.back()} />;
}
