import { useRouter } from 'expo-router';
import { Fragment, useState } from 'react';
import { View } from 'react-native';

import { useUserLocation } from '@/features/auth/_city/model/use-user-location';
import { useCity } from '@/support/city';
import { useLikedStatus } from '@/support/like';

import { ItemCard } from '../../_item-card';
import { parseBreadcrumbs } from '../../domain/breadcrumb';
import { useAgeGroup } from '../../model/use-age-group';
import { DiscoveryScreenLayout } from '../../ui/discovery-screen-layout';
import { ItemList } from '../../ui/item-list';
import { useCategories } from '../model/use-categories';
import { useCategoryItems } from '../model/use-category-items';
import {
  useCategoryFiltersQuery,
  useCategoryItemsFilters,
} from '../model/use-category-filters';
import { CategoryItemsHeader } from '../ui/category-items-header';
import { FilterPanel, type AttributeFilterDef } from '../ui/filter-panel';
import { PriceFilterSheet } from '../ui/price-filter-sheet';
import { PrimaryFilterRow } from '../ui/primary-filter-row';
import { PrimaryFilterRowSkeleton } from '../ui/primary-filter-row-skeleton';
import { RatingFilterSheet } from '../ui/rating-filter-sheet';
import { SubcategoriesRow } from '../ui/subcategories-row';
import { SubcategoriesRowSkeleton } from '../ui/subcategories-row-skeleton';

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
  const [priceVisible, setPriceVisible] = useState(false);
  const [ratingVisible, setRatingVisible] = useState(false);

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
    setPriceRange,
    setMinRating,
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
    ...filters,
  });

  const likedStatus = useLikedStatus(itemIds);

  const subcategoryList = subcategories.data ?? [];
  const typeFilters = filtersQuery.data?.typeFilters ?? [];
  const attributeDefs = (filtersQuery.data?.attributeFilters ?? []) as AttributeFilterDef[];
  const commonFilters = filtersQuery.data?.commonFilters;
  const locationCoords =
    userLocation.lat && userLocation.lng
      ? { lat: userLocation.lat, lng: userLocation.lng }
      : null;

  return (
    <DiscoveryScreenLayout
      header={
        <CategoryItemsHeader
          title={categoryName}
          onBackPress={() => router.back()}
          onSearchPress={() => router.push('/search' as never)}
        />
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
          ListHeaderComponent={
            <View>
              {subcategories.isLoading ? (
                <SubcategoriesRowSkeleton />
              ) : (
                <SubcategoriesRow
                  subcategories={subcategoryList}
                  parentBreadcrumbs={breadcrumbs}
                />
              )}
              {filtersQuery.isLoading ? (
                <PrimaryFilterRowSkeleton />
              ) : (
                <PrimaryFilterRow
                  hasActiveFilters={hasModalFilters}
                  onFilterPress={() => setFilterVisible(true)}
                  typeFilters={typeFilters}
                  selectedTypeIds={selectedTypeIds}
                  onToggleType={toggleType}
                  hasPriceRange={commonFilters?.hasPriceRange ?? false}
                  priceMin={filters.priceMin}
                  priceMax={filters.priceMax}
                  onPricePress={() => setPriceVisible(true)}
                  hasRating={commonFilters?.hasRating ?? false}
                  minRating={filters.minRating}
                  onRatingPress={() => setRatingVisible(true)}
                />
              )}
            </View>
          }
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
        <Fragment>
          {filtersQuery.data && (
            <FilterPanel
              visible={filterVisible}
              onClose={() => setFilterVisible(false)}
              onApply={applyPanelFilters}
              currentFilters={filters}
              attributeFilters={attributeDefs}
              commonFilters={filtersQuery.data.commonFilters}
              userLocation={locationCoords}
            />
          )}
          <PriceFilterSheet
            visible={priceVisible}
            initialMin={filters.priceMin}
            initialMax={filters.priceMax}
            onApply={setPriceRange}
            onClose={() => setPriceVisible(false)}
          />
          <RatingFilterSheet
            visible={ratingVisible}
            current={filters.minRating}
            onApply={setMinRating}
            onClose={() => setRatingVisible(false)}
          />
        </Fragment>
      }
    />
  );
}
