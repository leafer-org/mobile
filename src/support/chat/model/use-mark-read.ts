import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useApiFetchClient } from '@/kernel/api';

export function useMarkRead(chatId: string | null) {
  const fetchClient = useApiFetchClient();

  const mutation = useMutation({
    mutationFn: async (upToMessageId: string) => {
      if (!chatId) return;
      await fetchClient.POST('/chats/{chatId}/read', {
        params: { path: { chatId } },
        body: { upToMessageId },
      });
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
