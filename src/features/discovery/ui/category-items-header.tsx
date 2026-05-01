import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

import { Text } from '@/kernel/ui/text';

type Props = {
  categoryName: string;
  hasActiveFilters: boolean;
  onFilterPress: () => void;
};

export function CategoryItemsHeader({ categoryName, hasActiveFilters, onFilterPress }: Props) {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  return (
    <View className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 pt-12 pb-3 px-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          <TouchableOpacity onPress={() => router.back()} testID="back-button">
            <Ionicons name="arrow-back" size={24} color={isDark ? '#e2e8f0' : '#0f172a'} />
          </TouchableOpacity>
          <Text variant="h3" className="flex-1" numberOfLines={1}>
            {categoryName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onFilterPress}
          testID="filter-button"
          className="flex-row items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800"
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={hasActiveFilters ? '#0d9488' : isDark ? '#94a3b8' : '#64748b'}
          />
          <Text
            className={`text-sm ${hasActiveFilters ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Фильтры
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
