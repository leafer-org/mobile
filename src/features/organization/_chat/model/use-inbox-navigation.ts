import { useRouter } from 'expo-router';
import { useCallback } from 'react';

type Args = {
  organizationId: string;
  onChatPress?: (chatId: string) => void;
};

export function useInboxNavigation({ organizationId, onChatPress }: Args) {
  const router = useRouter();

  const goToChat = useCallback(
    (chatId: string) => {
      if (onChatPress) {
        onChatPress(chatId);
        return;
      }
      router.push(`/organizations/${organizationId}/inbox/${chatId}`);
    },
    [onChatPress, organizationId, router],
  );

  return { goToChat };
}
