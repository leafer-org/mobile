import { jwtDecode } from 'jwt-decode';

import { tokensStore } from './tokens-store';
import { publicFetchClient } from '@/kernel/api/provider';

const pissimisticExp = (exp: number) => {
  const now = Date.now() / 1000;
  const pissimiticExp = exp - 60;
  if (pissimiticExp < now) {
    return true;
  }
  return false;
};

export const getAccessToken = async () => {
  const tokens = tokensStore.get();
  const accessToken = tokens?.accessToken;

  if (!accessToken) {
    return;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (decoded.exp && pissimisticExp(decoded.exp)) {
      return refreshAccessToken();
    }

    return accessToken;
  } catch {
    return;
  }
};

let refreshAccessTokenPromise: Promise<string | undefined> | undefined;

export const refreshAccessToken = async () => {
  if (refreshAccessTokenPromise !== undefined) {
    return refreshAccessTokenPromise;
  }

  const tokens = tokensStore.get();
  const refreshToken = tokens?.refreshToken;

  if (!refreshToken) {
    return;
  }

  refreshAccessTokenPromise = publicFetchClient
    .GET('/auth/refresh', {
      params: {
        header: {
          'x-refresh-token': refreshToken,
        },
      },
    })
    .then(async ({ data }) => {
      if (data) {
        await tokensStore.set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        return data.accessToken;
      }

      await tokensStore.clear();

      return;
    })
    .catch(async () => {
      await tokensStore.clear();
      return;
    })
    .finally(() => {
      refreshAccessTokenPromise = undefined;
    });

  return refreshAccessTokenPromise;
};
