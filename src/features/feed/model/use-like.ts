import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';

/** Батч-проверка статуса лайков для набора itemIds. Вызывается на уровне экрана. */
export function useLikedStatus(itemIds: string[]) {
  const fetchClient = useApiFetchClient();
  const sorted = [...itemIds].sort();
  const key = sorted.join(',');

  return useQuery({
    enabled: sorted.length > 0,
    queryKey: ['liked-status', key],
    queryFn: async () => {
      const res = await fetchClient.POST('/items/liked-status', {
        body: { itemIds: sorted },
      });
      return new Set(res.data!.likedItemIds);
    },
    staleTime: 30_000,
  });
}

export function useToggleLike(itemId: string) {
  const fetchClient = useApiFetchClient();
  const queryClient = useQueryClient();

  const optimisticUpdate = (add: boolean) => {
    queryClient.setQueriesData<Set<string>>(
      { queryKey: ['liked-status'] },
      (prev) => {
        if (!prev) return prev;
        const next = new Set(prev);
        if (add) next.add(itemId);
        else next.delete(itemId);
        return next;
      },
    );
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['liked-status'] });
    queryClient.invalidateQueries({ queryKey: ['liked-items'] });
  };

  const likeMutation = useMutation({
    mutationFn: () => fetchClient.POST('/items/{itemId}/like', { params: { path: { itemId } } }),
    onMutate: () => optimisticUpdate(true),
    onSettled: invalidate,
  });

  const unlikeMutation = useMutation({
    mutationFn: () =>
      fetchClient.DELETE('/items/{itemId}/like', { params: { path: { itemId } } }),
    onMutate: () => optimisticUpdate(false),
    onSettled: invalidate,
  });

  return {
    toggle: (isLiked: boolean) => {
      if (isLiked) unlikeMutation.mutate();
      else likeMutation.mutate();
    },
    isPending: likeMutation.isPending || unlikeMutation.isPending,
  };
}
