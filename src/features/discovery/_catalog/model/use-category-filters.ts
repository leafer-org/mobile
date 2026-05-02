import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';

export type CategoryItemsFilters = {
  cityId?: string;
  ageGroup?: string;
  typeIds?: string;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  attributeValues?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
};

export function useCategoryFiltersQuery(categoryId: string) {
  const fetchClient = useApiFetchClient();

  return useQuery({
    enabled: categoryId.length > 0,
    queryKey: ['category-filters', categoryId],
    queryFn: async () => {
      const res = await fetchClient.GET('/categories/{id}/filters', {
        params: { path: { id: categoryId } },
      });
      return res.data!;
    },
  });
}

const INITIAL_FILTERS: CategoryItemsFilters = {};

export function useCategoryItemsFilters() {
  const [filters, setFilters] = useState<CategoryItemsFilters>(INITIAL_FILTERS);

  const toggleType = useCallback((typeId: string) => {
    setFilters((prev) => {
      const current = prev.typeIds ? prev.typeIds.split(',') : [];
      const next = current.includes(typeId)
        ? current.filter((id) => id !== typeId)
        : [...current, typeId];
      return { ...prev, typeIds: next.length > 0 ? next.join(',') : undefined };
    });
  }, []);

  const applyPanelFilters = useCallback(
    (panel: Omit<CategoryItemsFilters, 'cityId' | 'ageGroup' | 'typeIds'>) => {
      setFilters((prev) => ({ typeIds: prev.typeIds, ...panel }));
    },
    [],
  );

  const reset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const selectedTypeIds = useMemo(
    () => new Set(filters.typeIds ? filters.typeIds.split(',') : []),
    [filters.typeIds],
  );

  const hasModalFilters =
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.minRating !== undefined ||
    filters.attributeValues !== undefined ||
    filters.radiusKm !== undefined;

  return {
    filters,
    toggleType,
    selectedTypeIds,
    applyPanelFilters,
    reset,
    hasModalFilters,
  };
}
