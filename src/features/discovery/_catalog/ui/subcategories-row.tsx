import { Menu } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

import { encodeBreadcrumbs, type BreadcrumbItem } from '../../domain/breadcrumb';

type Subcategory = { categoryId: string; name: string };

type Props = {
  subcategories: Subcategory[];
  parentBreadcrumbs: BreadcrumbItem[];
};

export function SubcategoriesRow({ subcategories, parentBreadcrumbs }: Props) {
  const router = useRouter();

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
          className="flex-row items-center gap-1 px-3 py-1.5 rounded-md bg-white"
        >
          <Menu size={12} color="#1c1917" strokeWidth={1.5} />
          <Text
            className="text-xs text-stone-900 dark:text-stone-900"
            style={{ includeFontPadding: false, transform: [{ translateY: -1 }] }}
          >
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
            className="px-3 py-1.5 rounded-md bg-white"
          >
            <Text
              className="text-xs text-stone-900 dark:text-stone-900"
              style={{ includeFontPadding: false, transform: [{ translateY: -1 }] }}
            >
              {s.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
