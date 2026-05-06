import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api';

import type { ChatDetail } from '../domain/types';
import { chatQueryKeys } from './query-keys';

export function useChatDetail(chatId: string | null) {
  const fetchClient = useApiFetchClient();

  return useQuery({
    queryKey: chatId ? chatQueryKeys.detail(chatId) : ['chat', 'detail', 'null'],
    enabled: chatId !== null,
    queryFn: async (): Promise<ChatDetail> => {
      const { data, error } = await fetchClient.GET('/chats/{chatId}', {
        params: { path: { chatId: chatId as string } },
      });
      if (error || !data) throw new Error('failed_to_fetch_chat_detail');
      return data;
    },
  });
}
