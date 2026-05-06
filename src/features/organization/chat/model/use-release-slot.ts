import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api';
import { chatQueryKeys } from '@/support/chat';

export function useReleaseSlot(chatId: string) {
  const fetchClient = useApiFetchClient();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (participantId: string) => {
      const { error } = await fetchClient.POST(
        '/admin/chats/{chatId}/participants/{participantId}/release',
        { params: { path: { chatId, participantId } } },
      );
      if (error) throw new Error('failed_to_release');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chatQueryKeys.detail(chatId) });
      qc.invalidateQueries({ queryKey: chatQueryKeys.all });
    },
  });
}
