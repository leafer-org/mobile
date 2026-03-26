import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';

import type { ItemListView } from '../domain/types';
import { useAgeGroup } from '../model/use-age-group';
import { useCity } from '../model/use-city';
import { useFeed } from '../model/use-feed';
import { CityPickerModal } from '../ui/city-picker-modal';
import { FeedHeader } from '../ui/feed-header';
import { ItemList } from '../ui/item-list';

export function FeedScreen() {
  const { cityId, cityName, setCity } = useCity();
  const { ageGroup, setAgeGroup } = useAgeGroup();
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useFeed(cityId, ageGroup);

  const items: ItemListView[] = useMemo(
    () => (data?.pages.flatMap((p) => p.items) as ItemListView[]) ?? [],
    [data],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      <FeedHeader
        cityName={cityName || 'Выберите город'}
        ageGroup={ageGroup}
        onCityPress={() => setCityPickerVisible(true)}
        onAgeGroupChange={setAgeGroup}
      />
      <ItemList
        items={items}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        onEndReached={handleEndReached}
        onRefresh={handleRefresh}
        isRefreshing={isRefetching}
      />
      <CityPickerModal
        visible={cityPickerVisible}
        currentCityId={cityId}
        onSelect={setCity}
        onClose={() => setCityPickerVisible(false)}
      />
    </View>
  );
}
