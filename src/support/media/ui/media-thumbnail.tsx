import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, View } from 'react-native';

import type { ResolvedMediaItem } from '../types';
import type { VideoProcessingStatus } from '../model/use-video-preview';
import { Text } from '@/kernel/ui/text';
import { cn } from '@/kernel/ui/utils/cn';

const SIZE = 96;

export function MediaThumbnail({
  item,
  previewUrl,
  thumbnailUrl,
  videoStatus,
  videoProgress,
  onRemove,
  onPress,
  disabled,
  className,
}: {
  item: ResolvedMediaItem;
  previewUrl?: string | null;
  thumbnailUrl?: string | null;
  videoStatus?: VideoProcessingStatus | null;
  videoProgress?: number | null;
  onRemove?: () => void;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const isVideo = item.type === 'video';
  const isProcessing = videoStatus === 'pending' || videoStatus === 'processing';
  const isFailed = videoStatus === 'failed';
  const imageSource = thumbnailUrl ?? previewUrl ?? null;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      className={cn('overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-700', className)}
      style={{ width: SIZE, height: SIZE }}
    >
      {imageSource ? (
        <Image
          source={{ uri: imageSource }}
          style={{ width: SIZE, height: SIZE }}
          contentFit="cover"
        />
      ) : (
        <View className="h-full w-full items-center justify-center">
          <Ionicons
            name={isVideo ? 'videocam-outline' : 'image-outline'}
            size={28}
            color="#a8a29e"
          />
        </View>
      )}

      {isVideo && !isProcessing && !isFailed && (
        <View className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5">
          <Ionicons name="play" size={10} color="white" />
        </View>
      )}

      {isProcessing && (
        <View className="absolute inset-0 items-center justify-center bg-black/40">
          <ActivityIndicator color="white" />
          {videoProgress !== null && videoProgress !== undefined && (
            <Text className="mt-1 text-xs text-white">{Math.round(videoProgress)}%</Text>
          )}
        </View>
      )}

      {isFailed && (
        <View className="absolute inset-0 items-center justify-center bg-red-500/30">
          <Ionicons name="alert-circle" size={24} color="#ef4444" />
        </View>
      )}

      {onRemove && !disabled && (
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full bg-black/70"
        >
          <Ionicons name="close" size={14} color="white" />
        </Pressable>
      )}
    </Pressable>
  );
}
