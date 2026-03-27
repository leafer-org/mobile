import { useLocalSearchParams } from 'expo-router';

import { ItemDetailScreen } from '@/features/item-detail';

export default function ItemDetailRoute() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  return <ItemDetailScreen itemId={itemId} />;
}
