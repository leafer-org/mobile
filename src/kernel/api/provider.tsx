import { QueryClientProvider } from '@tanstack/react-query';
import createFetchClient, { ClientOptions } from 'openapi-fetch';
import { ReactNode } from 'react';

import { env } from '../env';
import { authMiddleware } from './auth-middleware';
import { normalizeServerUrl } from './base-url';
import type { paths } from './schema';
import { createApiContext, makeQueryClient } from '@/lib/api';
import { useStaticInitialize } from '@/lib/react/use-static-initialize';

const ApiContext = createApiContext<paths>();
const ApiPublicContext = createApiContext<paths>();

const makeFetchClient = (options: ClientOptions = {}) =>
  createFetchClient<paths>({
    baseUrl: normalizeServerUrl(env.EXPO_PUBLIC_API_BASE_URL),
    ...options,
    credentials: 'include',
  });

export const publicFetchClient = makeFetchClient();

const authFetchClient = makeFetchClient();
authFetchClient.use(authMiddleware);

export const PublicApiProvider = ({ children }: { children?: ReactNode }) => {
  const queryClient = useStaticInitialize(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider fetchClient={authFetchClient}>
        <ApiPublicContext.Provider fetchClient={publicFetchClient}>
          {children}
        </ApiPublicContext.Provider>
      </ApiContext.Provider>
    </QueryClientProvider>
  );
};

export const useApiPublic = ApiPublicContext.useApi;
export const usePublicFetchClient = ApiPublicContext.useFetchClient;
export const useApi = ApiContext.useApi;
export const useApiFetchClient = ApiContext.useFetchClient;

export type ApiFetchClient = ReturnType<typeof useApiFetchClient>;
