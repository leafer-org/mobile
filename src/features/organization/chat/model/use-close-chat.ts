import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api';
import { chatQueryKeys } from '@/support/chat';

export function useCloseChat(chatId: string) {
  const fetchClient = useApiFetchClient();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (reason?: string | null) => {
      const { error } = await fetchClient.POST('/admin/chats/{chatId}/close', {
        params: { path: { chatId } },
        body: { reason: reason ?? null },
      });
      if (error) throw new Error('failed_to_close');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chatQueryKeys.detail(chatId) });
    },
  });
}
