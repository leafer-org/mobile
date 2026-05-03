import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useApiFetchClient } from '@/kernel/api/provider';

export type AttributeFilter =
  | { attributeId: string; type: 'enum'; values: string[] }
  | { attributeId: string; type: 'number'; min?: number; max?: number }
  | { attributeId: string; type: 'boolean'; value: boolean }
  | { attributeId: string; type: 'text'; value: string };

export type CategoryItemsFilters = {
  typeIds: string[];
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  attributeFilters: AttributeFilter[];
  lat?: number;
  lng?: number;
  radiusKm?: number;
  dateFrom?: string;
  dateTo?: string;
  scheduleDayOfWeek?: number;
  scheduleTimeFrom?: string;
  scheduleTimeTo?: string;
};

export type PanelFilters = Omit<CategoryItemsFilters, 'typeIds'>;

const INITIAL_FILTERS: CategoryItemsFilters = {
  typeIds: [],
  attributeFilters: [],
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

export function useCategoryItemsFilters() {
  const [filters, setFilters] = useState<CategoryItemsFilters>(INITIAL_FILTERS);

  const toggleType = useCallback((typeId: string) => {
    setFilters((prev) => {
      const next = prev.typeIds.includes(typeId)
        ? prev.typeIds.filter((id) => id !== typeId)
        : [...prev.typeIds, typeId];
      return { ...prev, typeIds: next };
    });
  }, []);

  const applyPanelFilters = useCallback((panel: PanelFilters) => {
    setFilters((prev) => ({ ...panel, typeIds: prev.typeIds }));
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

  const reset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const selectedTypeIds = useMemo(() => new Set(filters.typeIds), [filters.typeIds]);

  const hasModalFilters =
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.minRating !== undefined ||
    filters.attributeFilters.length > 0 ||
    filters.radiusKm !== undefined ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined ||
    filters.scheduleDayOfWeek !== undefined ||
    filters.scheduleTimeFrom !== undefined ||
    filters.scheduleTimeTo !== undefined;

  return {
    filters,
    toggleType,
    selectedTypeIds,
    applyPanelFilters,
    setPriceRange,
    setMinRating,
    reset,
    hasModalFilters,
  };
}
