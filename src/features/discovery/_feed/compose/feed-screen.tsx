import { View } from 'react-native';

import { useCity } from '@/support/city';
import { useLikedStatus } from '@/support/like';

import { ItemCard } from '../../_item-card';
import { useAgeGroup } from '../../model/use-age-group';
import { AgeGroupToggle } from '../../ui/age-group-toggle';
import { DiscoveryHeader } from '../../ui/discovery-header';
import { DiscoveryScreenLayout } from '../../ui/discovery-screen-layout';
import { ItemList } from '../../ui/item-list';
import { SearchStub } from '../../ui/search-stub';
import { useFeed } from '../model/use-feed';

export function FeedScreen() {
  const { cityId } = useCity();
  const { ageGroup, setAgeGroup } = useAgeGroup();
  const {
    items,
    itemIds,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isRefreshing,
    handleEndReached,
    handleRefresh,
  } = useFeed(cityId, ageGroup);
  const likedStatus = useLikedStatus(itemIds);

  return (
    <DiscoveryScreenLayout
      header={<DiscoveryHeader searchSlot={<SearchStub />} />}
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
            <View className="px-3 pb-2">
              <AgeGroupToggle value={ageGroup} onChange={setAgeGroup} />
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
    />
  );
}
