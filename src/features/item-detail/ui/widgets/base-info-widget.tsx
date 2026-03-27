import { Dimensions, View } from 'react-native';

import { MediaCarousel, type ResolvedMediaItem } from '@/support/media';
import { Text } from '@/kernel/ui/text';

const SCREEN_WIDTH = Dimensions.get('window').width;

export function BaseInfoWidget({
  title,
  description,
  media,
}: {
  title: string;
  description: string;
  media: ResolvedMediaItem[];
}) {
  return (
    <View className="gap-3">
      {media.length > 0 && (
        <MediaCarousel media={media} width={SCREEN_WIDTH} height={SCREEN_WIDTH * 0.75} />
      )}
      <View className="px-4 gap-1">
        <Text variant="h2">{title}</Text>
        {description ? <Text variant="body" className="text-slate-600 dark:text-slate-300">{description}</Text> : null}
      </View>
    </View>
  );
}
