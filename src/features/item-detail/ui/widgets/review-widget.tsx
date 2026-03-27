import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/kernel/ui/text';

export function ReviewWidget({
  label,
  rating,
  reviewCount,
}: {
  label: string;
  rating?: number | null;
  reviewCount: number;
}) {
  return (
    <View className="px-4 flex-row items-center gap-2">
      <Ionicons name="star" size={16} color="#f59e0b" />
      <Text variant="body" className="font-medium">
        {rating != null ? rating.toFixed(1) : '—'}
      </Text>
      <Text variant="caption">
        {reviewCount} {label}
      </Text>
    </View>
  );
}
