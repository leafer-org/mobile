import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { useImagePreview } from '@/support/media';

type Props = {
  mediaIds: string[];
  onPressMedia?: (mediaId: string) => void;
};

export function MessageMediaGrid({ mediaIds, onPressMedia }: Props) {
  if (mediaIds.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-1 mt-1 -mx-0.5">
      {mediaIds.map((id) => (
        <MediaTile key={id} mediaId={id} onPress={onPressMedia ? () => onPressMedia(id) : undefined} />
      ))}
    </View>
  );
}

function MediaTile({ mediaId, onPress }: { mediaId: string; onPress?: () => void }) {
  const preview = useImagePreview({ fileId: mediaId, queryKeyPrefix: 'chat-media' });
  const url = 'previewUrl' in preview ? preview.previewUrl : null;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="rounded-md overflow-hidden bg-stone-300 dark:bg-stone-600"
      style={{ width: 140, height: 140 }}
    >
      {url ? <Image source={{ uri: url }} style={{ width: 140, height: 140 }} contentFit="cover" /> : null}
    </Pressable>
  );
}
