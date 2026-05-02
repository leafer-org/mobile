import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity, View, useColorScheme } from 'react-native';

import { Text } from '@/kernel/ui/text';

import { encodeBreadcrumbs, type BreadcrumbItem } from '../../domain/breadcrumb';

type Subcategory = { categoryId: string; name: string };

type Props = {
  subcategories: Subcategory[];
  parentBreadcrumbs: BreadcrumbItem[];
};

export function SubcategoriesRow({ subcategories, parentBreadcrumbs }: Props) {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  if (subcategories.length === 0) return null;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 4, gap: 6 }}
      >
        <TouchableOpacity
          testID="subcategory-all"
          activeOpacity={0.7}
          onPress={() => router.dismiss(1)}
          className="flex-row items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800"
        >
          <Ionicons name="menu-outline" size={14} color={isDark ? '#a8a29e' : '#78716c'} />
          <Text className="text-sm text-stone-900 dark:text-white">
            Все
          </Text>
        </TouchableOpacity>

        {subcategories.map((s) => (
          <TouchableOpacity
            key={s.categoryId}
            testID={`subcategory-chip-${s.categoryId}`}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: '/catalog/[categoryId]',
                params: {
                  categoryId: s.categoryId,
                  categoryName: s.name,
                  breadcrumbs: encodeBreadcrumbs([
                    ...parentBreadcrumbs,
                    { id: s.categoryId, name: s.name },
                  ]),
                },
              })
            }
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800"
          >
            <Text className="text-sm text-stone-900 dark:text-white">
              {s.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
