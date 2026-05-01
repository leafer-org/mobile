import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';

export type CategoryItemsFilters = {
  childCategoryId?: string;
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

  const setChildCategory = useCallback((childCategoryId: string | undefined) => {
    setFilters((prev) => ({ ...prev, childCategoryId }));
  }, []);

  const setTypeIds = useCallback((typeIds: string | undefined) => {
    setFilters((prev) => ({ ...prev, typeIds }));
  }, []);

  const setPriceRange = useCallback(
    (priceMin: number | undefined, priceMax: number | undefined) => {
      setFilters((prev) => ({ ...prev, priceMin, priceMax }));
    },
    [],
  );

  const setMinRating = useCallback((minRating: number | undefined) => {
    setFilters((prev) => ({ ...prev, minRating }));
  }, []);

  const applyPanelFilters = useCallback(
    (panel: Omit<CategoryItemsFilters, 'childCategoryId'>) => {
      setFilters((prev) => ({ childCategoryId: prev.childCategoryId, ...panel }));
    },
    [],
  );

  const reset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const hasActiveFilters =
    filters.typeIds !== undefined ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.minRating !== undefined ||
    filters.attributeValues !== undefined ||
    filters.radiusKm !== undefined;

  return {
    filters,
    setChildCategory,
    setTypeIds,
    setPriceRange,
    setMinRating,
    applyPanelFilters,
    reset,
    hasActiveFilters,
  };
}
