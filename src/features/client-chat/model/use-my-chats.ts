import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api';
import { chatQueryKeys } from '@/support/chat';
import type { ChatList } from '@/support/chat';

export function useMyChats() {
  const fetchClient = useApiFetchClient();

  return useQuery({
    queryKey: chatQueryKeys.myChats(),
    queryFn: async (): Promise<ChatList> => {
      const { data, error } = await fetchClient.GET('/chats', {
        params: { query: { from: 0, size: 100 } },
      });
      if (error || !data) throw new Error('failed_to_fetch_my_chats');
      return data;
    },
  });
}
