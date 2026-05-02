import { useRouter } from 'expo-router';
import { Fragment, useState } from 'react';

import { useUserLocation } from '@/features/auth/_city/model/use-user-location';
import { useCity } from '@/support/city';

import { ItemCard } from '../../_item-card';
import { parseBreadcrumbs } from '../../domain/breadcrumb';
import { useAgeGroup } from '../../model/use-age-group';
import { useLikedStatus } from '../../model/use-like';
import { BackButton } from '../../ui/back-button';
import { Breadcrumbs } from '../../ui/breadcrumbs';
import { DiscoveryHeader } from '../../ui/discovery-header';
import { DiscoveryScreenLayout } from '../../ui/discovery-screen-layout';
import { ItemList } from '../../ui/item-list';
import { SearchStub } from '../../ui/search-stub';
import { useCategories } from '../model/use-categories';
import { useCategoryItems } from '../model/use-category-items';
import {
  useCategoryFiltersQuery,
  useCategoryItemsFilters,
} from '../model/use-category-filters';
import { FilterPanel } from '../ui/filter-panel';
import { PrimaryFilterRow } from '../ui/primary-filter-row';
import { SubcategoriesRow } from '../ui/subcategories-row';

type Props = {
  categoryId: string;
  categoryName: string;
  breadcrumbs?: string;
};

export function CategoryItemsScreen({
  categoryId,
  categoryName,
  breadcrumbs: rawBreadcrumbs,
}: Props) {
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);

  const parsedBreadcrumbs = parseBreadcrumbs(rawBreadcrumbs);
  const breadcrumbs =
    parsedBreadcrumbs.length > 0
      ? parsedBreadcrumbs
      : [{ id: categoryId, name: categoryName }];

  const { cityId } = useCity();
  const { ageGroup } = useAgeGroup();
  const userLocation = useUserLocation();

  const subcategories = useCategories(categoryId);
  const filtersQuery = useCategoryFiltersQuery(categoryId);
  const {
    filters,
    toggleType,
    selectedTypeIds,
    applyPanelFilters,
    hasModalFilters,
  } = useCategoryItemsFilters();

  const {
    items,
    itemIds,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isRefreshing,
    handleEndReached,
    handleRefresh,
  } = useCategoryItems(categoryId, {
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

  const likedStatus = useLikedStatus(itemIds);

  const subcategoryList = subcategories.data ?? [];
  const typeFilters = filtersQuery.data?.typeFilters ?? [];
  const commonFilters = filtersQuery.data?.commonFilters;
  const locationCoords =
    userLocation.lat && userLocation.lng
      ? { lat: userLocation.lat, lng: userLocation.lng }
      : null;

  return (
    <DiscoveryScreenLayout
      header={
        <Fragment>
          <DiscoveryHeader
            leading={<BackButton onPress={() => router.back()} />}
            breadcrumbsSlot={
              <Breadcrumbs
                items={breadcrumbs}
                onRootPress={() => router.dismissAll()}
                onItemPress={(index) => {
                  const popCount = breadcrumbs.length - 1 - index;
                  if (popCount > 0) router.dismiss(popCount);
                }}
              />
            }
            searchSlot={<SearchStub placeholder={`Поиск в «${categoryName}»`} />}
          />
          <SubcategoriesRow
            subcategories={subcategoryList}
            parentBreadcrumbs={breadcrumbs}
          />
          <PrimaryFilterRow
            hasActiveFilters={hasModalFilters}
            onFilterPress={() => setFilterVisible(true)}
            typeFilters={typeFilters}
            selectedTypeIds={selectedTypeIds}
            onToggleType={toggleType}
            hasPriceRange={commonFilters?.hasPriceRange ?? false}
            priceMin={filters.priceMin}
            priceMax={filters.priceMax}
            hasRating={commonFilters?.hasRating ?? false}
            minRating={filters.minRating}
          />
        </Fragment>
      }
      body={
        <ItemList
          items={items}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onEndReached={handleEndReached}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          renderItem={(item, { isVisible }) => (
            <ItemCard
              item={item}
              isVisible={isVisible}
              isLiked={likedStatus.data?.has(item.itemId) ?? false}
            />
          )}
        />
      }
      overlay={
        filtersQuery.data && (
          <FilterPanel
            visible={filterVisible}
            onClose={() => setFilterVisible(false)}
            onApply={applyPanelFilters}
            currentFilters={filters}
            attributeFilters={filtersQuery.data.attributeFilters}
            commonFilters={filtersQuery.data.commonFilters}
            userLocation={locationCoords}
          />
        )
      }
    />
  );
}
