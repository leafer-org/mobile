import { ItemCard } from '../../_item-card';
import { DiscoveryScreenLayout } from '../../ui/discovery-screen-layout';
import { ItemList } from '../../ui/item-list';
import { useLikedItems } from '../model/use-liked-items';
import { FavoritesHeader } from '../ui/favorites-header';
import { FavoritesSearchInput } from '../ui/favorites-search-input';

export function LikedItemsScreen() {
  const {
    search,
    setSearch,
    items,
    allLiked,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isRefreshing,
    handleEndReached,
    handleRefresh,
  } = useLikedItems();

  return (
    <DiscoveryScreenLayout
      header={
        <FavoritesHeader
          searchSlot={
            <FavoritesSearchInput value={search} onChangeText={setSearch} />
          }
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
          renderItem={(item, { isVisible }) => (
            <ItemCard
              item={item}
              isVisible={isVisible}
              isLiked={allLiked.has(item.itemId)}
            />
          )}
        />
      }
    />
  );
}
