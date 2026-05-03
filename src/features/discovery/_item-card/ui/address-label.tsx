import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export function AddressLabel({ address }: { address: string }) {
  return (
    <View className="flex-row items-center gap-1">
      <Ionicons name="location-outline" size={12} color="#a8a29e" />
      <Text className="text-xs text-stone-500 dark:text-stone-400 flex-shrink" numberOfLines={1}>
        {address}
      </Text>
    </View>
  );
}
