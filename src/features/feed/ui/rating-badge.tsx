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
    <View className="flex-row items-center gap-0.5">
      <Ionicons name="star" size={10} color="#f59e0b" />
      <Text className="text-[10px] text-slate-700 dark:text-slate-300">
        {rating.toFixed(1)}
      </Text>
      <Text className="text-[10px] text-slate-400">({reviewCount})</Text>
    </View>
  );
}
