import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, useColorScheme, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

type Props = {
  name: string;
  avatarUrl: string | null;
  isActive: boolean;
  onPress: () => void;
};

export function OrgSwitcherRow({ name, avatarUrl, isActive, onPress }: Props) {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#a8a29e' : '#78716c';
  const activeIconColor = isDark ? '#ffffff' : '#1c1917';

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: isDark ? '#27272a' : '#f5f5f4' }}
      accessibilityRole="button"
      accessibilityLabel={name}
      className="flex-row items-center gap-3 px-4 py-3"
    >
      <View className="w-10 h-10 rounded-full overflow-hidden bg-stone-100 dark:bg-stone-800 items-center justify-center">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <Ionicons name="business-outline" size={20} color={iconColor} />
        )}
      </View>
      <Text numberOfLines={1} className="flex-1 text-base text-stone-900 dark:text-white">
        {name}
      </Text>
      {isActive && <Ionicons name="checkmark" size={20} color={activeIconColor} />}
    </Pressable>
  );
}
