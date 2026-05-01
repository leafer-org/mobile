import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';

import type { ItemListView } from '@/features/feed/domain/types';
import { ItemList } from '@/features/feed/ui/item-list';
import { useLikedStatus } from '@/features/feed/model/use-like';
import { useCity } from '@/features/feed/model/use-city';
import { useAgeGroup } from '@/features/feed/model/use-age-group';
import { useUserLocation } from '@/features/auth/_city/model/use-user-location';

import { useCategories } from '../model/use-categories';
import { useCategoryItems } from '../model/use-category-items';
import {
  useCategoryFiltersQuery,
  useCategoryItemsFilters,
} from '../model/use-category-filters';
import { CategoryItemsHeader } from '../ui/category-items-header';
import { FilterPanel } from '../ui/filter-panel';
import { SubcategoryChips } from '../ui/subcategory-chips';

type Props = {
  categoryId: string;
  categoryName: string;
};

export function CategoryItemsScreen({ categoryId, categoryName }: Props) {
  const [filterVisible, setFilterVisible] = useState(false);

  const { cityId } = useCity();
  const { ageGroup } = useAgeGroup();
  const userLocation = useUserLocation();

  const subcategories = useCategories(categoryId);
  const filtersQuery = useCategoryFiltersQuery(categoryId);
  const {
    filters,
    setChildCategory,
    applyPanelFilters,
    hasActiveFilters,
  } = useCategoryItemsFilters();

  // Если выбрана подкатегория — запрашиваем её товары, иначе — текущей категории
  const effectiveCategoryId = filters.childCategoryId ?? categoryId;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useCategoryItems(effectiveCategoryId, {
    cityId,
    ageGroup,
    typeIds: filters.typeIds,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    minRating: filters.minRating,
    attributeValues: filters.attributeValues,
    lat: filters.lat,
    lng: filters.lng,
    radiusKm: filters.radiusKm,
  });

  const items: ItemListView[] = useMemo(
    () => (data?.pages.flatMap((p) => p.items) as ItemListView[]) ?? [],
    [data],
  );

  const itemIds = useMemo(() => items.map((i) => i.itemId), [items]);
  const likedStatus = useLikedStatus(itemIds);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const subcategoryList = subcategories.data ?? [];
  const locationCoords = userLocation.lat && userLocation.lng
    ? { lat: userLocation.lat, lng: userLocation.lng }
    : null;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <CategoryItemsHeader
        categoryName={categoryName}
        hasActiveFilters={hasActiveFilters}
        onFilterPress={() => setFilterVisible(true)}
      />

      <ItemList
        items={items}
        likedItemIds={likedStatus.data}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        onEndReached={handleEndReached}
        onRefresh={handleRefresh}
        isRefreshing={isRefetching}
        ListHeaderComponent={
          subcategoryList.length > 0 ? (
            <SubcategoryChips
              categories={subcategoryList}
              selectedId={filters.childCategoryId}
              onSelect={setChildCategory}
            />
          ) : undefined
        }
      />

      {filtersQuery.data && (
        <FilterPanel
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={applyPanelFilters}
          currentFilters={filters}
          typeFilters={filtersQuery.data.typeFilters}
          attributeFilters={filtersQuery.data.attributeFilters}
          commonFilters={filtersQuery.data.commonFilters}
          userLocation={locationCoords}
        />
      )}
    </View>
  );
}
