import { storage } from '@/lib/storage';

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

const TOKENS_KEY = 'leafer_tokens';

export const tokensStore = {
  cache: undefined as SessionTokens | undefined,

  get: () => {
    if (tokensStore.cache) {
      return tokensStore.cache;
    }

    try {
      const result = storage.getItem(TOKENS_KEY);

      const token = result ? JSON.parse(result) : null;

      tokensStore.cache = token;

      return token;
    } catch (error) {
      console.debug('Failed to get tokens from secure store:', error);
      return;
    }
  },
  set: async (tokens: SessionTokens) => {
    tokensStore.cache = tokens;

    try {
      storage.setItem(TOKENS_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.debug('Failed to save tokens to secure store:', error);
    }
  },
  clear: async () => {
    tokensStore.cache = undefined;
    try {
      await storage.deleteItem(TOKENS_KEY);
    } catch (error) {
      console.debug('Failed to clear tokens from secure store:', error);
    }
  },
};
