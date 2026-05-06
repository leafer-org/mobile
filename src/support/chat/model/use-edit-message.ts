import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api';

import type { SendMessageBody } from '../domain/types';
import { chatQueryKeys } from './query-keys';

type Args = {
  chatId: string;
  messageId: string;
  body: SendMessageBody;
};

export function useEditMessage() {
  const fetchClient = useApiFetchClient();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, messageId, body }: Args) => {
      const { error } = await fetchClient.PATCH('/chats/{chatId}/messages/{messageId}', {
        params: { path: { chatId, messageId } },
        body,
      });
      if (error) throw new Error('failed_to_edit_message');
      return { chatId };
    },
    onSuccess: ({ chatId }) => {
      qc.invalidateQueries({ queryKey: chatQueryKeys.messages(chatId) });
    },
  });
}
