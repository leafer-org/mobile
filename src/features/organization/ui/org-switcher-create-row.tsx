import { Ionicons } from '@expo/vector-icons';
import { Pressable, useColorScheme, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export function OrgSwitcherCreateRow({ onPress }: { onPress: () => void }) {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#a8a29e' : '#78716c';

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: isDark ? '#27272a' : '#f5f5f4' }}
      accessibilityRole="button"
      accessibilityLabel="Создать организацию"
      className="flex-row items-center gap-3 px-4 py-3 border-t border-stone-100 dark:border-stone-800"
    >
      <View className="w-10 h-10 rounded-full items-center justify-center bg-stone-100 dark:bg-stone-800">
        <Ionicons name="add" size={22} color={iconColor} />
      </View>
      <Text className="flex-1 text-base text-stone-900 dark:text-white">Новая организация</Text>
    </Pressable>
  );
}
