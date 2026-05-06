import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api';
import { chatQueryKeys } from '@/support/chat';
import type { SendMessageBody } from '@/support/chat';

type SendArgs =
  | { mode: 'existing'; chatId: string; body: SendMessageBody }
  | {
      mode: 'open-with-organization';
      organizationId: string;
      contextItemId: string | null;
      body: SendMessageBody;
    };

type SendResult = { chatId: string; messageId: string | null };

export function useSendAsUser() {
  const fetchClient = useApiFetchClient();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (args: SendArgs): Promise<SendResult> => {
      if (args.mode === 'existing') {
        const { data, error } = await fetchClient.POST('/chats/{chatId}/messages', {
          params: { path: { chatId: args.chatId } },
          body: args.body,
        });
        if (error || !data) throw new Error('failed_to_send');
        return { chatId: args.chatId, messageId: data.messageId };
      }

      const { data, error } = await fetchClient.POST('/chats', {
        body: {
          organizationId: args.organizationId,
          contextItemId: args.contextItemId,
          message: args.body,
        },
      });
      if (error || !data) throw new Error('failed_to_open_chat');
      return { chatId: data.chatId, messageId: null };
    },
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: chatQueryKeys.detail(result.chatId) });
      qc.invalidateQueries({ queryKey: chatQueryKeys.messages(result.chatId) });
      qc.invalidateQueries({ queryKey: chatQueryKeys.myChats() });
    },
  });
}
