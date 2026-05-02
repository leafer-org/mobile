import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/kernel/ui/text';

export function LocationWidget({ address }: { address?: string | null }) {
  if (!address) return null;

  return (
    <View className="px-4 flex-row items-center gap-2">
      <Ionicons name="location-outline" size={16} color={'#a8a29e'} />
      <Text variant="body">{address}</Text>
    </View>
  );
}
