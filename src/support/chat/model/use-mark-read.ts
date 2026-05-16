import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useApiFetchClient } from '@/kernel/api';

import { chatQueryKeys } from './query-keys';

export function useMarkRead(chatId: string | null) {
  const fetchClient = useApiFetchClient();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (upToMessageId: string) => {
      if (!chatId) return;
      await fetchClient.POST('/chats/{chatId}/read', {
        params: { path: { chatId } },
        body: { upToMessageId },
      });
    },
    onSuccess: async () => {
      // chat_participant_user_reads обновляется async через outbox→kafka.
      // Инвалидируем списки и unread-summary; react-query повторит запрос
      // когда projection догонит (refetch при focus / next mount).
      await Promise.all([
        qc.invalidateQueries({ queryKey: chatQueryKeys.unreadSummary() }),
        qc.invalidateQueries({ queryKey: chatQueryKeys.all }),
      ]);
    },
  });

  const lastSentRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return {
    markRead: (upToMessageId: string) => {
      if (lastSentRef.current === upToMessageId) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        lastSentRef.current = upToMessageId;
        mutation.mutate(upToMessageId);
      }, 1000);
    },
  };
}
