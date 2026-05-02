import { Image, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export function OwnerWidget({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string | null;
}) {
  return (
    <View className="px-4 flex-row items-center gap-3">
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} className="w-10 h-10 rounded-full" />
      ) : (
        <View className="w-10 h-10 rounded-full bg-[#FF7F50] items-center justify-center">
          <Text className="text-white font-semibold">{name[0]?.toUpperCase()}</Text>
        </View>
      )}
      <Text variant="body" className="font-medium">{name}</Text>
    </View>
  );
}
