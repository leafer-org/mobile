import { Ionicons } from '@expo/vector-icons';
import { Pressable, useColorScheme, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

export function ManagementMenuRow({ icon, label, onPress }: Props) {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#a8a29e' : '#78716c';

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: isDark ? '#27272a' : '#f5f5f4' }}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-row items-center gap-3 px-4 py-4 border-b border-stone-100 dark:border-stone-800"
    >
      <Ionicons name={icon} size={22} color={iconColor} />
      <View className="flex-1">
        <Text className="text-base text-stone-900 dark:text-white">{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={iconColor} />
    </Pressable>
  );
}
