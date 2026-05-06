import { ReactNode, createContext, useContext, useEffect, useMemo } from 'react';
import type { Centrifuge } from 'centrifuge';

import { useApiFetchClient } from '@/kernel/api';

import { disconnectCentrifuge, getCentrifugeClient } from './centrifuge-client';

const RealtimeContext = createContext<Centrifuge | null>(null);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const fetchClient = useApiFetchClient();

  const client = useMemo(
    () =>
      getCentrifugeClient(async () => {
        const { data, error } = await fetchClient.GET('/chats/centrifugo-token');
        if (error || !data) throw new Error('failed_to_fetch_centrifugo_token');
        return data;
      }),
    [fetchClient],
  );

  useEffect(() => {
    return () => {
      disconnectCentrifuge();
    };
  }, []);

  return <RealtimeContext.Provider value={client}>{children}</RealtimeContext.Provider>;
}

export function useRealtimeClient(): Centrifuge {
  const client = useContext(RealtimeContext);
  if (!client) throw new Error('useRealtimeClient must be used inside RealtimeProvider');
  return client;
}
