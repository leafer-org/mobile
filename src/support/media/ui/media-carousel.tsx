import { useCallback, useRef, useState } from 'react';
import { FlatList, Image, View, type ViewToken } from 'react-native';

import type { ResolvedMediaItem } from '../types';
import { VideoPlayer } from './video-player';
import { cn } from '@/kernel/ui/utils/cn';

export function MediaCarousel({
  media,
  isVisible = true,
  width,
  height,
}: {
  media: ResolvedMediaItem[];
  isVisible?: boolean;
  width: number;
  height: number;
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
        className="bg-slate-200 dark:bg-slate-700 items-center justify-center"
        style={{ width, height }}
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
          <MediaSlide item={item} isActive={isVisible && index === activeIndex} width={width} height={height} />
        )}
        style={{ width }}
      />
      {media.length > 1 && (
        <View className="flex-row justify-center gap-1 absolute bottom-2 left-0 right-0">
          {media.map((_, i) => (
            <View
              key={i}
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                i === activeIndex ? 'bg-white' : 'bg-white/50',
              )}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function MediaSlide({
  item,
  isActive,
  width,
  height,
}: {
  item: ResolvedMediaItem;
  isActive: boolean;
  width: number;
  height: number;
}) {
  if (item.type === 'image' && item.preview?.url) {
    return <Image source={{ uri: item.preview.url }} style={{ width, height }} resizeMode="cover" />;
  }

  if (item.type === 'video') {
    return <VideoPlayer preview={item.preview} width={width} height={height} isActive={isActive} />;
  }

  return <View className="bg-slate-200 dark:bg-slate-700" style={{ width, height }} />;
}
