import { useInfiniteQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api';

import type { ChatMessage } from '../domain/types';
import { chatQueryKeys } from './query-keys';

type MessagesPage = {
  messages: ChatMessage[];
  nextCursor: string | null;
};

export function useChatMessages(chatId: string | null) {
  const fetchClient = useApiFetchClient();

  return useInfiniteQuery({
    queryKey: chatId ? chatQueryKeys.messages(chatId) : ['chat', 'messages', 'null'],
    enabled: chatId !== null,
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }): Promise<MessagesPage> => {
      const { data, error } = await fetchClient.GET('/chats/{chatId}/messages', {
        params: {
          path: { chatId: chatId as string },
          query: { cursor: pageParam ?? undefined, limit: 50 },
        },
      });
      if (error || !data) throw new Error('failed_to_fetch_messages');
      return data;
    },
    getNextPageParam: (last) => last.nextCursor,
  });
}
