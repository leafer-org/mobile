import { useQuery } from '@tanstack/react-query';

import type { City } from '../domain/types';
import { usePublicFetchClient } from '@/kernel/api/provider';

export function useCities() {
  const publicClient = usePublicFetchClient();

  return useQuery({
    queryKey: ['cities'],
    queryFn: async (): Promise<City[]> => {
      const { data, error } = await publicClient.GET('/cities');
      if (error) throw error;
      return data;
    },
  });
}
