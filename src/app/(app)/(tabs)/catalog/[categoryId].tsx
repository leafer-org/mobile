import { useLocalSearchParams } from 'expo-router';

import { CategoryItemsScreen } from '@/features/discovery';

export default function CategoryItemsRoute() {
  const { categoryId, categoryName, breadcrumbs } = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
    breadcrumbs?: string;
  }>();

  return (
    <CategoryItemsScreen
      categoryId={categoryId}
      categoryName={categoryName ?? ''}
      breadcrumbs={breadcrumbs}
    />
  );
}
