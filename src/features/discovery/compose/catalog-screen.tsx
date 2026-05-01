import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import { Text } from '@/kernel/ui/text';
import { useCategories } from '../model/use-categories';

export function CatalogScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900 px-6">
        <Ionicons name="grid-outline" size={48} color={isDark ? '#475569' : '#94a3b8'} />
        <Text variant="h3" className="text-center mt-4">Нет доступных категорий</Text>
        <Text variant="caption" className="text-center mt-2">
          Категории появятся после добавления администратором
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <View className="pt-14 pb-3 px-4 border-b border-slate-200 dark:border-slate-700">
        <Text variant="h2">Каталог</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.categoryId}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            testID={`category-${item.categoryId}`}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: '/(app)/category/[categoryId]',
                params: { categoryId: item.categoryId, categoryName: item.name },
              })
            }
            className="flex-row items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-4 gap-3"
          >
            <View className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 items-center justify-center">
              <Ionicons
                name="folder-outline"
                size={20}
                color={isDark ? '#5eead4' : '#0d9488'}
              />
            </View>
            <View className="flex-1">
              <Text variant="label">{item.name}</Text>
              <Text variant="caption">
                {item.itemCount} {formatItemCount(item.itemCount)}
                {item.childCount > 0 && ` · ${item.childCount} подкатегорий`}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#475569' : '#94a3b8'}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function formatItemCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'услуга';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'услуги';
  return 'услуг';
}
