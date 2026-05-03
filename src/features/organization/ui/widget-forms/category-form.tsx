import { ScrollView, TouchableOpacity, View } from 'react-native';

import { useCategories } from '@/features/discovery/_catalog/model/use-categories';
import { Spinner } from '@/kernel/ui/spinner';
import { Text } from '@/kernel/ui/text';

export type CategoryValue = {
  selectedId: string | null;
  selectedName: string | null;
};

export function CategoryForm({
  value,
  onChange,
}: {
  value: CategoryValue;
  onChange: (next: CategoryValue) => void;
}) {
  const { data, isPending } = useCategories();

  if (isPending) {
    return (
      <View className="items-center py-8">
        <Spinner />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Text variant="body" color="secondary">
        Категории недоступны
      </Text>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ gap: 8 }}>
      {data.map((cat) => {
        const isSelected = value.selectedId === cat.categoryId;
        return (
          <TouchableOpacity
            key={cat.categoryId}
            onPress={() => onChange({ selectedId: cat.categoryId, selectedName: cat.name })}
            activeOpacity={0.7}
            className={`rounded-xl border p-4 ${
              isSelected
                ? 'border-stone-900 dark:border-white bg-stone-100 dark:bg-stone-800'
                : 'border-stone-200 dark:border-stone-700'
            }`}
          >
            <Text variant="body" className="font-medium">
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
