import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Client } from 'openapi-fetch';
import createClient, { OpenapiQueryClient } from 'openapi-react-query';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { DEFAULT_QUERY_CLIENT_OPTIONS } from './constants';
import { useStaticInitialize } from '@/lib/react/use-static-initialize';

type ApiContextValue<Paths extends object> = {
  fetchClient: Client<Paths> | null;
  $api: OpenapiQueryClient<Paths> | null;
};

type ApiProviderProps<Paths extends object> = PropsWithChildren & {
  fetchClient: Client<Paths>;
  dehydratedState?: DehydratedState | null;
};

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: DEFAULT_QUERY_CLIENT_OPTIONS,
  });

export const createApiContext = <Paths extends object>() => {
  const ApiContext = createContext<ApiContextValue<Paths>>({
    fetchClient: null,
    $api: null,
  });

  const Provider = ({ children, fetchClient, dehydratedState }: ApiProviderProps<Paths>) => {
    const queryClient = useStaticInitialize(makeQueryClient);

    const ctx = useMemo(
      () => ({
        fetchClient,
        $api: createClient(fetchClient),
      }),
      [fetchClient],
    );

    return (
      <ApiContext.Provider value={ctx}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
        </QueryClientProvider>
      </ApiContext.Provider>
    );
  };

  const useApi = () => {
    const { $api } = useContext(ApiContext) ?? {};

    if (!$api) {
      throw new Error('API client not provided');
    }

    return $api;
  };

  const useFetchClient = () => {
    const { fetchClient } = useContext(ApiContext) ?? {};

    if (!fetchClient) {
      throw new Error('Fetch client not provided');
    }

    return fetchClient;
  };

  return {
    Provider,
    useApi,
    useFetchClient,
  };
};
