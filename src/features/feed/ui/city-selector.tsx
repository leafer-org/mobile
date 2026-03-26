import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/kernel/ui/text';

type Props = {
  cityName: string;
  onPress: () => void;
};

export function CitySelector({ cityName, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center gap-1" activeOpacity={0.7}>
      <Ionicons name="location-outline" size={16} color="#0d9488" />
      <Text className="text-sm font-medium text-slate-900 dark:text-white">{cityName}</Text>
      <Ionicons name="chevron-down" size={14} color="#94a3b8" />
    </TouchableOpacity>
  );
}
