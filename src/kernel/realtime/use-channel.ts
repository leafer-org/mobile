import { useEffect } from 'react';
import type { PublicationContext, Subscription } from 'centrifuge';

import { useRealtimeClient } from './realtime-provider';

export type RealtimeEvent = { type: string; payload: unknown };

export function useChannel(
  channel: string | null,
  onEvent: (event: RealtimeEvent) => void,
): void {
  const client = useRealtimeClient();

  useEffect(() => {
    if (!channel) return;

    let sub: Subscription | null = client.getSubscription(channel);
    const isShared = sub !== null;
    if (!sub) {
      sub = client.newSubscription(channel);
    }

    const handler = (ctx: PublicationContext) => {
      const data = ctx.data as RealtimeEvent | undefined;
      if (data && typeof data.type === 'string') {
        onEvent(data);
      }
    };

    sub.on('publication', handler);
    if (sub.state !== 'subscribed' && sub.state !== 'subscribing') {
      sub.subscribe();
    }

    return () => {
      sub?.off('publication', handler);
      if (!isShared) {
        sub?.unsubscribe();
        sub?.removeAllListeners();
        client.removeSubscription(sub!);
      }
    };
  }, [client, channel, onEvent]);
}
