import { QueryClient } from '@tanstack/react-query';
import { Client } from 'openapi-fetch';
import createClient, { OpenapiQueryClient } from 'openapi-react-query';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { DEFAULT_QUERY_CLIENT_OPTIONS } from './constants';

type ApiContextValue<Paths extends object> = {
  fetchClient: Client<Paths> | null;
  $api: OpenapiQueryClient<Paths> | null;
};

type ApiProviderProps<Paths extends object> = PropsWithChildren & {
  fetchClient: Client<Paths>;
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

  const Provider = ({ children, fetchClient }: ApiProviderProps<Paths>) => {
    const ctx = useMemo(
      () => ({
        fetchClient,
        $api: createClient(fetchClient),
      }),
      [fetchClient],
    );

    return <ApiContext.Provider value={ctx}>{children}</ApiContext.Provider>;
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
