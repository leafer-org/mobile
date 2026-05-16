import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api';
import { chatQueryKeys } from '@/support/chat';
import type { ChatList, ChatListItem } from '@/support/chat';

type Result = {
  chat: ChatListItem | null;
  isLoading: boolean;
};

export function useResolveOrgChat(organizationId: string): Result {
  const fetchClient = useApiFetchClient();

  const query = useQuery({
    queryKey: chatQueryKeys.myChats(),
    queryFn: async (): Promise<ChatList> => {
      const { data, error } = await fetchClient.GET('/chats', {
        params: { query: { from: 0, size: 100 } },
      });
      if (error || !data) throw new Error('failed_to_fetch_my_chats');
      return data;
    },
  });

  const chat =
    query.data?.chats.find((c) =>
      c.participants.some(
        (p) => p.subject?.kind === 'organization' && p.subject.id === organizationId,
      ),
    ) ?? null;

  return { chat, isLoading: query.isLoading };
}
