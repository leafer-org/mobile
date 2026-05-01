import { FlatList, TouchableOpacity } from 'react-native';

import { Text } from '@/kernel/ui/text';
import { cn } from '@/kernel/ui/utils/cn';

type Category = {
  categoryId: string;
  name: string;
};

type Props = {
  categories: Category[];
  selectedId: string | undefined;
  onSelect: (id: string | undefined) => void;
};

export function SubcategoryChips({ categories, selectedId, onSelect }: Props) {
  if (categories.length === 0) return null;

  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item.categoryId}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}
      renderItem={({ item }) => {
        const isActive = item.categoryId === selectedId;
        return (
          <TouchableOpacity
            testID={`subcategory-chip-${item.categoryId}`}
            activeOpacity={0.7}
            onPress={() => onSelect(isActive ? undefined : item.categoryId)}
            className={cn(
              'px-4 py-2 rounded-full',
              isActive
                ? 'bg-teal-600 dark:bg-teal-500'
                : 'bg-slate-100 dark:bg-slate-800',
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                isActive
                  ? 'text-white'
                  : 'text-slate-700 dark:text-slate-300',
              )}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}
