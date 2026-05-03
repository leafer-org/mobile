import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useColorScheme, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

type Props = {
  name: string;
  avatarUrl: string | null;
  rating: number | null;
  reviewCount: number;
  itemCount: number;
};

export function OrganizationHeader({ name, avatarUrl, rating, reviewCount, itemCount }: Props) {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#a8a29e' : '#78716c';

  return (
    <View className="px-4 pt-4 pb-3 gap-3">
      <View className="flex-row items-center gap-3">
        <View className="w-16 h-16 rounded-full overflow-hidden bg-stone-100 dark:bg-stone-800 items-center justify-center">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          ) : (
            <Ionicons name="business-outline" size={28} color={iconColor} />
          )}
        </View>
        <View className="flex-1">
          <Text numberOfLines={2} className="text-lg font-semibold text-stone-900 dark:text-white">
            {name}
          </Text>
          <View className="flex-row items-center gap-3 pt-1">
            {rating !== null && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={14} color="#eab308" />
                <Text className="text-sm text-stone-700 dark:text-stone-200">
                  {rating.toFixed(1)}
                </Text>
                <Text className="text-xs text-stone-500 dark:text-stone-400">
                  ({reviewCount})
                </Text>
              </View>
            )}
            <Text className="text-xs text-stone-500 dark:text-stone-400">
              {formatItemCount(itemCount)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function formatItemCount(n: number): string {
  if (n === 0) return 'Без товаров';
  const lastTwo = n % 100;
  const last = n % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return `${n} товаров`;
  if (last === 1) return `${n} товар`;
  if (last >= 2 && last <= 4) return `${n} товара`;
  return `${n} товаров`;
}
