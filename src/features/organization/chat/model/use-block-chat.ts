import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api';
import { chatQueryKeys } from '@/support/chat';

export function useBlockChat(chatId: string) {
  const fetchClient = useApiFetchClient();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (reason?: string | null) => {
      const { error } = await fetchClient.POST('/admin/chats/{chatId}/block', {
        params: { path: { chatId } },
        body: { reason: reason ?? null },
      });
      if (error) throw new Error('failed_to_block');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chatQueryKeys.detail(chatId) });
    },
  });
}

export function useUnblockChat(chatId: string) {
  const fetchClient = useApiFetchClient();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await fetchClient.POST('/admin/chats/{chatId}/unblock', {
        params: { path: { chatId } },
      });
      if (error) throw new Error('failed_to_unblock');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chatQueryKeys.detail(chatId) });
    },
  });
}
