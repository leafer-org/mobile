import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, useColorScheme, View } from 'react-native';

import type { ItemListView } from '../../domain/types';
import { Text } from '@/kernel/ui/text';

type RowProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  testID?: string;
};

/**
 * Плоская строка подсказки: иконка слева опциональна, без подложек/кружков.
 * Используется для query-подсказок ("Искать «X»" — с иконкой, остальные — без)
 * и для entity-подсказок (категория/тип/организация — со своей иконкой).
 */
export function SuggestionRow({ icon, title, onPress, testID }: RowProps) {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#a8a29e' : '#78716c';

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      android_ripple={{ color: isDark ? '#27272a' : '#f5f5f4' }}
      className="flex-row items-center gap-3 px-4 py-2.5 active:bg-stone-100 dark:active:bg-stone-800"
    >
      {icon ? (
        <Ionicons name={icon} size={16} color={iconColor} />
      ) : (
        <View style={{ width: 16 }} />
      )}
      <Text numberOfLines={1} className="flex-1 text-sm text-stone-900 dark:text-white">
        {title}
      </Text>
    </Pressable>
  );
}

export function ItemSuggestionRow({
  item,
  onPress,
}: {
  item: ItemListView;
  onPress: () => void;
}) {
  const isDark = useColorScheme() === 'dark';
  const firstImage = item.media.find((m) => m.type === 'image');
  const imageUrl =
    firstImage && firstImage.type === 'image' ? firstImage.preview?.url ?? null : null;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: isDark ? '#27272a' : '#f5f5f4' }}
      className="flex-row items-center gap-3 px-4 py-2 active:bg-stone-100 dark:active:bg-stone-800"
    >
      <View className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800">
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        )}
      </View>
      <Text numberOfLines={1} className="flex-1 text-sm text-stone-900 dark:text-white">
        {item.title}
      </Text>
    </Pressable>
  );
}

export function OrganizationSuggestionRow({
  name,
  avatarUrl,
  onPress,
}: {
  name: string;
  avatarUrl: string | null;
  onPress: () => void;
}) {
  const isDark = useColorScheme() === 'dark';

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: isDark ? '#27272a' : '#f5f5f4' }}
      className="flex-row items-center gap-3 px-4 py-2 active:bg-stone-100 dark:active:bg-stone-800"
    >
      <View className="w-10 h-10 rounded-full overflow-hidden bg-stone-100 dark:bg-stone-800 items-center justify-center">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <Ionicons name="business-outline" size={18} color={isDark ? '#a8a29e' : '#78716c'} />
        )}
      </View>
      <Text numberOfLines={1} className="flex-1 text-sm text-stone-900 dark:text-white">
        {name}
      </Text>
    </Pressable>
  );
}
