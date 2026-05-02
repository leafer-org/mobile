import { Image, View } from 'react-native';

import type { ResolvedMediaItem } from '@/support/media';
import { Text } from '@/kernel/ui/text';

type TeamMember = {
  name: string;
  description?: string;
  media: ResolvedMediaItem[];
};

export function TeamWidget({ title, members }: { title: string; members: TeamMember[] }) {
  if (members.length === 0) return null;

  return (
    <View className="px-4 gap-3">
      <Text variant="label">{title}</Text>
      {members.map((m, i) => (
        <View key={i} className="flex-row items-center gap-3">
          {m.media[0]?.type === 'image' && m.media[0].preview?.url ? (
            <Image source={{ uri: m.media[0].preview.url }} className="w-10 h-10 rounded-full" />
          ) : (
            <View className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700 items-center justify-center">
              <Text className="text-sm font-semibold text-stone-500">{m.name[0]?.toUpperCase()}</Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="text-sm font-medium text-stone-900 dark:text-white">{m.name}</Text>
            {m.description ? (
              <Text className="text-xs text-stone-500 dark:text-stone-400">{m.description}</Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}
