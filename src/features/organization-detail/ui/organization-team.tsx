import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ScrollView, useColorScheme, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

type Member = {
  name: string;
  description?: string | null;
  avatarUrl?: string | null;
};

type Props = {
  title: string;
  members: Member[];
};

export function OrganizationTeam({ title, members }: Props) {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#a8a29e' : '#78716c';

  if (members.length === 0) return null;

  return (
    <View className="pt-4 gap-2">
      <Text className="px-4 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {members.map((m, idx) => (
          <View key={`${m.name}-${idx}`} className="w-32 items-center gap-2">
            <View className="w-20 h-20 rounded-full overflow-hidden bg-stone-100 dark:bg-stone-800 items-center justify-center">
              {m.avatarUrl ? (
                <Image
                  source={{ uri: m.avatarUrl }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              ) : (
                <Ionicons name="person-outline" size={32} color={iconColor} />
              )}
            </View>
            <Text
              numberOfLines={2}
              className="text-xs text-center text-stone-900 dark:text-white"
            >
              {m.name}
            </Text>
            {m.description && (
              <Text
                numberOfLines={2}
                className="text-[10px] text-center text-stone-500 dark:text-stone-400"
              >
                {m.description}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
