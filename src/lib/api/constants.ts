export const STALE_TIME = 30 * 1000;

export const DEFAULT_QUERY_CLIENT_OPTIONS = {
  queries: {
    retry: false,
    staleTime: STALE_TIME,
  },
};
