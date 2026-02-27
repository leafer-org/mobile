import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { authMiddlewareSubject } from '../api/auth-middleware';
import { SessionTokens, tokensStore } from './tokens-store';
import { useSubscribeSubject } from '@/lib/react-rx';

export function useLogoutApiListener() {
  const { logoutSession } = useLogoutSession();
  const router = useRouter();
  useSubscribeSubject(authMiddlewareSubject, (event) => {
    if (event.type === 'unauthorized') {
      logoutSession();
      router.replace('/(auth)/phone');
    }
  });
}

export function useLoginSession() {
  const queryClient = useQueryClient();

  const loginSession = useCallback(
    async ({ accessToken, refreshToken }: SessionTokens) => {
      await tokensStore.set({ accessToken, refreshToken });
      await queryClient.resetQueries();
    },
    [queryClient],
  );

  return { loginSession };
}

export function useLogoutSession() {
  const queryClient = useQueryClient();

  const logoutSession = useCallback(async () => {
    await tokensStore.clear();
    await queryClient.resetQueries();
  }, [queryClient]);

  return { logoutSession };
}
