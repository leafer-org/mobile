import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  View,
  useColorScheme,
} from 'react-native';

import { Text } from '@/kernel/ui/text';

import type { CategoryListView } from '../../domain/types';
import { CategoryTile } from './category-tile';

const NUM_COLUMNS = 3;
const HORIZONTAL_PADDING = 12;
const GRID_GAP = 8;

const TILE_WIDTH =
  (Dimensions.get('window').width - HORIZONTAL_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;
const TILE_HEIGHT = TILE_WIDTH * 1.15;

type Props = {
  isLoading: boolean;
  categories: CategoryListView[];
  onCategoryPress: (category: CategoryListView) => void;
  ageGroupSlot?: ReactNode;
  feedSlot?: ReactNode;
};

export function CatalogBody({
  isLoading,
  categories,
  onCategoryPress,
  ageGroupSlot,
  feedSlot,
}: Props) {
  const isDark = useColorScheme() === 'dark';

  return (
    <ScrollView
      className="flex-1 bg-stone-50 dark:bg-stone-900"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {ageGroupSlot ? (
        <View className="px-3 pb-2">{ageGroupSlot}</View>
      ) : null}
      {isLoading ? (
        <View className="py-8 items-center">
          <ActivityIndicator size="large" color={'#a8a29e'} />
        </View>
      ) : categories.length === 0 ? (
        <View className="py-12 items-center px-6">
          <Ionicons
            name="grid-outline"
            size={48}
            color={isDark ? '#57534e' : '#a8a29e'}
          />
          <Text variant="h3" className="text-center mt-4">
            Нет доступных категорий
          </Text>
          <Text variant="caption" className="text-center mt-2">
            Категории появятся после добавления администратором
          </Text>
        </View>
      ) : (
        <View
          className="flex-row flex-wrap"
          style={{ paddingHorizontal: HORIZONTAL_PADDING, gap: GRID_GAP }}
        >
          {categories.map((cat) => (
            <CategoryTile
              key={cat.categoryId}
              name={cat.name}
              iconUrl={cat.iconUrl}
              width={TILE_WIDTH}
              height={TILE_HEIGHT}
              testID={`category-${cat.categoryId}`}
              onPress={() => onCategoryPress(cat)}
            />
          ))}
        </View>
      )}

      {feedSlot}
    </ScrollView>
  );
}
