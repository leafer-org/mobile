import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useChannel } from '@/kernel/realtime';
import type { RealtimeEvent } from '@/kernel/realtime';

import { chatQueryKeys } from './query-keys';

export function useInboxRealtime(channel: string | null) {
  const qc = useQueryClient();

  const handler = useCallback(
    (event: RealtimeEvent) => {
      switch (event.type) {
        case 'chat.opened':
        case 'chat.preview-updated':
        case 'chat.status-changed':
        case 'chat.read':
        case 'participant.claimed':
        case 'participant.released':
        case 'participant.reassigned':
          qc.invalidateQueries({ queryKey: chatQueryKeys.all });
          break;
      }
    },
    [qc],
  );

  useChannel(channel, handler);
}
