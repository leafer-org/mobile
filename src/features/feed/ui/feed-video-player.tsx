import { useEffect, useRef } from 'react';
import { Image, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

import type { ResolvedVideoMedia } from '../domain/types';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  preview: ResolvedVideoMedia['preview'];
  width: number;
  height: number;
  isActive: boolean;
};

export function FeedVideoPlayer({ preview, width, height, isActive }: Props) {
  const videoUrl = preview?.mp4PreviewUrl ?? preview?.hlsUrl;
  const isReady = preview?.processingStatus === 'ready' && videoUrl;

  const player = useVideoPlayer(isReady ? videoUrl : null, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (!player) return;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [player, isActive]);

  if (!isReady) {
    return (
      <View
        className="bg-slate-800 rounded-xl items-center justify-center"
        style={{ width, height }}
      >
        {preview?.thumbnailUrl ? (
          <Image
            source={{ uri: preview.thumbnailUrl }}
            style={{ width, height }}
            resizeMode="cover"
            className="rounded-xl"
          />
        ) : (
          <Ionicons name="videocam-outline" size={48} color="#94a3b8" />
        )}
      </View>
    );
  }

  return (
    <View style={{ width, height }} className="rounded-xl overflow-hidden">
      <VideoView
        player={player}
        style={{ width, height }}
        nativeControls={false}
        contentFit="cover"
      />
    </View>
  );
}
