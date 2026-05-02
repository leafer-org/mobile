import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, useColorScheme } from 'react-native';

import { Text } from '@/kernel/ui/text';

type Props = {
  placeholder?: string;
};

export function SearchStub({ placeholder = 'Поиск' }: Props) {
  const isDark = useColorScheme() === 'dark';

  return (
    <TouchableOpacity
      testID="search-stub"
      activeOpacity={0.7}
      className="flex-row items-center gap-2 bg-stone-100 dark:bg-stone-800 rounded-xl px-3 py-2"
    >
      <Ionicons
        name="search-outline"
        size={16}
        color={isDark ? '#a8a29e' : '#78716c'}
      />
      <Text
        numberOfLines={1}
        className="flex-1 text-sm text-stone-500 dark:text-stone-400"
      >
        {placeholder}
      </Text>
      <Ionicons
        name="map-outline"
        size={16}
        color={isDark ? '#a8a29e' : '#78716c'}
      />
    </TouchableOpacity>
  );
}
