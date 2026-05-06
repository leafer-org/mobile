import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api';

import { chatQueryKeys } from './query-keys';

type Args = { chatId: string; messageId: string };

export function useDeleteMessage() {
  const fetchClient = useApiFetchClient();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, messageId }: Args) => {
      const { error } = await fetchClient.DELETE('/chats/{chatId}/messages/{messageId}', {
        params: { path: { chatId, messageId } },
      });
      if (error) throw new Error('failed_to_delete_message');
      return { chatId };
    },
    onSuccess: ({ chatId }) => {
      qc.invalidateQueries({ queryKey: chatQueryKeys.messages(chatId) });
      qc.invalidateQueries({ queryKey: chatQueryKeys.detail(chatId) });
      qc.invalidateQueries({ queryKey: chatQueryKeys.myChats() });
    },
  });
}
