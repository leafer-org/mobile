import { Ionicons } from '@expo/vector-icons';
import { Pressable, useColorScheme, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

type Props = {
  text: string;
  onPress: () => void;
  onRemove: () => void;
};

export function RecentChip({ text, onPress, onRemove }: Props) {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#a8a29e' : '#78716c';

  return (
    <View className="flex-row items-center bg-stone-100 dark:bg-stone-800 rounded-full pl-3 pr-1.5 py-1">
      <Pressable onPress={onPress} hitSlop={4}>
        <Text numberOfLines={1} className="text-xs text-stone-900 dark:text-white pr-1.5">
          {text}
        </Text>
      </Pressable>
      <Pressable
        onPress={onRemove}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={`Удалить «${text}» из недавних`}
        className="p-0.5"
      >
        <Ionicons name="close" size={14} color={iconColor} />
      </Pressable>
    </View>
  );
}
