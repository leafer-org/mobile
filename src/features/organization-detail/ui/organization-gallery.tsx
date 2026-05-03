import { Image } from 'expo-image';
import { Dimensions, ScrollView, View } from 'react-native';

import type { ResolvedMediaItem } from '@/features/discovery/domain/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = Math.min(SCREEN_WIDTH * 0.7, 280);
const IMAGE_HEIGHT = Math.round(IMAGE_WIDTH * 0.66);

export function OrganizationGallery({ media }: { media: ResolvedMediaItem[] }) {
  const images = media.filter((m): m is Extract<ResolvedMediaItem, { type: 'image' }> => m.type === 'image');
  if (images.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {images.map((m) => (
        <View
          key={m.mediaId}
          className="rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800"
          style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
        >
          {m.preview?.url && (
            <Image
              source={{ uri: m.preview.url }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          )}
        </View>
      ))}
    </ScrollView>
  );
}
