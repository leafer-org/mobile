import { useEffect } from 'react';
import { Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';

import type { ResolvedVideoMedia } from '../types';

type Props = {
  preview: ResolvedVideoMedia['preview'];
  width: number;
  height: number;
  isActive: boolean;
};

export function VideoPlayer({ preview, width, height, isActive }: Props) {
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
      <View className="bg-stone-800 items-center justify-center" style={{ width, height }}>
        {preview?.thumbnailUrl ? (
          <Image source={{ uri: preview.thumbnailUrl }} style={{ width, height }} resizeMode="cover" />
        ) : (
          <Ionicons name="videocam-outline" size={48} color="#a8a29e" />
        )}
      </View>
    );
  }

  return (
    <View style={{ width, height }} className="overflow-hidden">
      <VideoView player={player} style={{ width, height }} nativeControls={false} contentFit="cover" />
    </View>
  );
}
