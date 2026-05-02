import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/kernel/ui/text';

export function RatingBadge({
  rating,
  reviewCount,
}: {
  rating: number | null;
  reviewCount: number;
}) {
  if (rating == null) return null;

  return (
    <View className="flex-row items-center gap-1">
      <Ionicons name="star" size={12} color="#f59e0b" />
      <Text className="text-xs text-stone-700 dark:text-stone-300">
        {rating.toFixed(1)}
      </Text>
      <Text className="text-xs text-stone-400">({reviewCount})</Text>
    </View>
  );
}
