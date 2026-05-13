import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api';
import { chatQueryKeys } from '@/support/chat';
import type { SendMessageBody } from '@/support/chat';

type Args = {
  chatId: string;
  body: SendMessageBody;
  claim?: boolean;
};

export function useSendAsEmployee() {
  const fetchClient = useApiFetchClient();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, body, claim }: Args) => {
      const { data, error } = await fetchClient.POST('/admin/chats/{chatId}/messages', {
        params: { path: { chatId }, query: { claim: claim ?? false } },
        body,
      });
      if (error || !data) throw new Error('failed_to_send_as_employee');
      return { ...data, chatId };
    },
    onSuccess: async (result) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: chatQueryKeys.detail(result.chatId) }),
        qc.invalidateQueries({ queryKey: chatQueryKeys.messages(result.chatId) }),
        qc.invalidateQueries({ queryKey: chatQueryKeys.all }),
      ]);
    },
  });
}
