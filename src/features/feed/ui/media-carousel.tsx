import { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, View, type ViewToken } from 'react-native';

import type { ResolvedMediaItem } from '../domain/types';
import { FeedVideoPlayer } from './feed-video-player';
import { cn } from '@/kernel/ui/utils/cn';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 32;
const MEDIA_WIDTH = SCREEN_WIDTH - CARD_PADDING;
const MEDIA_HEIGHT = MEDIA_WIDTH * 0.75;

export function MediaCarousel({
  media,
  isVisible = true,
}: {
  media: ResolvedMediaItem[];
  isVisible?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0]?.index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfigRef = useRef({ itemVisiblePercentThreshold: 50 });

  if (media.length === 0) {
    return (
      <View
        className="bg-slate-200 dark:bg-slate-700 items-center justify-center rounded-xl"
        style={{ width: MEDIA_WIDTH, height: MEDIA_HEIGHT }}
      />
    );
  }

  return (
    <View>
      <FlatList
        data={media}
        keyExtractor={(item) => item.mediaId}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfigRef.current}
        renderItem={({ item, index }) => (
          <MediaSlide item={item} isActive={isVisible && index === activeIndex} />
        )}
        style={{ width: MEDIA_WIDTH }}
      />
      {media.length > 1 && (
        <View className="flex-row justify-center gap-1 mt-2">
          {media.map((_, i) => (
            <View
              key={i}
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                i === activeIndex
                  ? 'bg-teal-600 dark:bg-teal-400'
                  : 'bg-slate-300 dark:bg-slate-600',
              )}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function MediaSlide({ item, isActive }: { item: ResolvedMediaItem; isActive: boolean }) {
  if (item.type === 'image' && item.preview?.url) {
    return (
      <Image
        source={{ uri: item.preview.url }}
        style={{ width: MEDIA_WIDTH, height: MEDIA_HEIGHT }}
        resizeMode="cover"
        className="rounded-xl"
      />
    );
  }

  if (item.type === 'video') {
    return (
      <FeedVideoPlayer
        preview={item.preview}
        width={MEDIA_WIDTH}
        height={MEDIA_HEIGHT}
        isActive={isActive}
      />
    );
  }

  return (
    <View
      className="bg-slate-200 dark:bg-slate-700 rounded-xl"
      style={{ width: MEDIA_WIDTH, height: MEDIA_HEIGHT }}
    />
  );
}
