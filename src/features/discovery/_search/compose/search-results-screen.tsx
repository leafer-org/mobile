import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useLikedStatus } from '@/support/like';
import { useCity } from '@/support/city';

import { ItemCard } from '../../_item-card';
import { useAgeGroup } from '../../model/use-age-group';
import { ItemList } from '../../ui/item-list';
import { useSearchResults } from '../model/use-search-results';
import { Text } from '@/kernel/ui/text';

type Props = {
  query: string;
};

export function SearchResultsScreen({ query }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#a8a29e' : '#78716c';

  const { cityId } = useCity();
  const { ageGroup } = useAgeGroup();
  const [_priceMin] = useState<number | undefined>(undefined);
  const [_priceMax] = useState<number | undefined>(undefined);

  const {
    items,
    itemIds,
    total,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isRefreshing,
    handleEndReached,
    handleRefresh,
  } = useSearchResults({
    query,
    cityId,
    ageGroup,
    priceMin: _priceMin,
    priceMax: _priceMax,
  });

  const likedStatus = useLikedStatus(itemIds);

  return (
    <View className="flex-1 bg-stone-50 dark:bg-stone-900">
      <View
        className="bg-white dark:bg-stone-900 px-3 pb-2"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Назад"
          >
            <Ionicons name="arrow-back" size={22} color={iconColor} />
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="flex-1 flex-row items-center gap-2 bg-stone-100 dark:bg-stone-800 rounded-xl px-3 py-2"
            testID="search-results-input"
          >
            <Ionicons name="search-outline" size={16} color={iconColor} />
            <Text numberOfLines={1} className="flex-1 text-sm text-stone-900 dark:text-white">
              {query}
            </Text>
          </Pressable>
        </View>
        {!isLoading && (
          <Text className="px-1 pt-2 text-xs text-stone-500 dark:text-stone-400">
            {formatTotal(total)}
          </Text>
        )}
      </View>

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
    </View>
  );
}

function formatTotal(total: number): string {
  if (total === 0) return 'Ничего не найдено';
  const lastTwo = total % 100;
  const last = total % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return `${total} результатов`;
  if (last === 1) return `${total} результат`;
  if (last >= 2 && last <= 4) return `${total} результата`;
  return `${total} результатов`;
}
