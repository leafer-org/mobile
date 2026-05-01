import { useLocalSearchParams } from 'expo-router';

import { CategoryItemsScreen } from '@/features/discovery';

export default function CategoryItemsRoute() {
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
  }>();

  return (
    <CategoryItemsScreen
      categoryId={categoryId}
      categoryName={categoryName ?? ''}
    />
  );
}
