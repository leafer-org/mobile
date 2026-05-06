import { Ionicons } from '@expo/vector-icons';
import { Pressable, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/kernel/ui/text';

type Props = {
  title: string;
  onBack?: () => void;
  /** Если задан — title становится Pressable с шевроном (паттерн org-switcher). */
  onTitlePress?: () => void;
  body: React.ReactNode;
};

export function DetailScreenLayout({ title, onBack, onTitlePress, body }: Props) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#a8a29e' : '#78716c';

  return (
    <View className="flex-1 bg-stone-50 dark:bg-stone-900">
      <View
        className="bg-white dark:bg-stone-900 px-3 pb-2 flex-row items-center gap-2"
        style={{ paddingTop: insets.top + 12 }}
      >
        {onBack && (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Назад"
          >
            <Ionicons name="arrow-back" size={22} color={iconColor} />
          </Pressable>
        )}
        {onTitlePress ? (
          <Pressable
            onPress={onTitlePress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Сменить организацию"
            className="flex-1 flex-row items-center gap-1.5"
          >
            <Text
              numberOfLines={1}
              className="flex-shrink text-base font-medium text-stone-900 dark:text-white"
            >
              {title}
            </Text>
            <Ionicons name="chevron-down" size={18} color={iconColor} />
          </Pressable>
        ) : (
          <Text
            numberOfLines={1}
            className="flex-1 text-base font-medium text-stone-900 dark:text-white"
          >
            {title}
          </Text>
        )}
      </View>
      {body}
    </View>
  );
}
