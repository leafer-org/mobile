import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export function TeamMemberRow({
  name,
  description,
  onPress,
  onRemove,
  disabled,
}: {
  name: string;
  description?: string;
  onPress: () => void;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const isDark = useColorScheme() === 'dark';
  const displayName = name.trim() || 'Без имени';

  return (
    <View className="flex-row items-center gap-2 rounded-xl border border-stone-200 dark:border-stone-700 px-3 py-2">
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        className="flex-1 flex-row items-center gap-3"
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-stone-200 dark:bg-stone-700">
          <Text variant="label">{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <View className="flex-1">
          <Text variant="body" numberOfLines={1}>
            {displayName}
          </Text>
          {description ? (
            <Text variant="caption" numberOfLines={1}>
              {description}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={18} color={isDark ? '#a8a29e' : '#78716c'} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onRemove}
        disabled={disabled}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Удалить участника"
        className="h-10 w-10 items-center justify-center"
      >
        <Ionicons name="trash-outline" size={18} color={isDark ? '#a8a29e' : '#78716c'} />
      </TouchableOpacity>
    </View>
  );
}
