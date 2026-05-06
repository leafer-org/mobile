import { Centrifuge } from 'centrifuge';

import { env } from '@/kernel/env';
import { normalizeServerUrl } from '@/kernel/api/base-url';

type TokenFetcher = () => Promise<{ token: string; expiresAt: string }>;

let instance: Centrifuge | null = null;

function resolveWsUrl(): string {
  if (env.EXPO_PUBLIC_CENTRIFUGO_WS_URL) {
    return normalizeServerUrl(env.EXPO_PUBLIC_CENTRIFUGO_WS_URL);
  }
  const apiUrl = normalizeServerUrl(env.EXPO_PUBLIC_API_BASE_URL);
  const wsUrl = apiUrl.replace(/^http(s?):\/\//, 'ws$1://').replace(/\/+$/, '');
  return `${wsUrl}/connection/websocket`;
}

export function getCentrifugeClient(getToken: TokenFetcher): Centrifuge {
  if (instance) return instance;

  instance = new Centrifuge(resolveWsUrl(), {
    getToken: async () => {
      const { token } = await getToken();
      return token;
    },
  });

  instance.connect();
  return instance;
}

export function disconnectCentrifuge(): void {
  if (!instance) return;
  instance.disconnect();
  instance = null;
}
