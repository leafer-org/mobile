import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';

import type { ResolvedMediaItem } from '../types';
import { useUploadImage } from '../model/use-upload-image';
import { useUploadVideo } from '../model/use-upload-video';
import { MediaPickerThumbnail } from './media-picker-thumbnail';
import { Text } from '@/kernel/ui/text';
import { cn } from '@/kernel/ui/utils/cn';

export function MediaPickerField({
  value,
  onChange,
  disabled,
  acceptVideo = true,
  uploadName = 'media-gallery',
  imageMaxSizeMb = 20,
  videoMaxSizeMb = 500,
}: {
  value: ResolvedMediaItem[];
  onChange: (next: ResolvedMediaItem[]) => void;
  disabled?: boolean;
  acceptVideo?: boolean;
  uploadName?: string;
  imageMaxSizeMb?: number;
  videoMaxSizeMb?: number;
}) {
  const imageUpload = useUploadImage({ name: uploadName, maxSizeMb: imageMaxSizeMb });
  const videoUpload = useUploadVideo({ name: uploadName, maxSizeMb: videoMaxSizeMb });

  const isUploading = imageUpload.isUploading || videoUpload.isUploading;
  const uploadProgress = videoUpload.isUploading ? videoUpload.progress : imageUpload.progress;
  const uploadError = imageUpload.error ?? videoUpload.error ?? null;

  const handleAddImage = useCallback(async () => {
    try {
      const fileId = await imageUpload.pickAndUpload();
      if (fileId) {
        onChange([...value, { type: 'image', mediaId: fileId }]);
        imageUpload.reset();
      }
    } catch {
      // error is exposed via imageUpload.error
    }
  }, [imageUpload, onChange, value]);

  const handleAddVideo = useCallback(async () => {
    try {
      const mediaId = await videoUpload.pickAndUpload();
      if (mediaId) {
        onChange([...value, { type: 'video', mediaId }]);
        videoUpload.reset();
      }
    } catch {
      // error is exposed via videoUpload.error
    }
  }, [videoUpload, onChange, value]);

  const handleRemove = useCallback(
    (mediaId: string) => onChange(value.filter((m) => m.mediaId !== mediaId)),
    [onChange, value],
  );

  return (
    <View className="gap-2">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 px-1">
        {value.map((item) => (
          <MediaPickerThumbnail
            key={item.mediaId}
            item={item}
            onRemove={() => handleRemove(item.mediaId)}
            disabled={disabled}
          />
        ))}
        {isUploading && <UploadingTile progress={uploadProgress} />}
      </ScrollView>

      <View className="flex-row gap-2">
        <AddButton
          icon="image-outline"
          label="Фото"
          onPress={handleAddImage}
          disabled={isUploading || disabled}
        />
        {acceptVideo && (
          <AddButton
            icon="videocam-outline"
            label="Видео"
            onPress={handleAddVideo}
            disabled={isUploading || disabled}
          />
        )}
      </View>

      {uploadError && (
        <Text className="text-sm text-red-500">{uploadError.message}</Text>
      )}
    </View>
  );
}

function AddButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: 'image-outline' | 'videocam-outline';
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      className={cn(
        'flex-row items-center gap-1.5 rounded-md bg-stone-200 px-3 py-2 dark:bg-stone-700',
        disabled && 'opacity-50',
      )}
    >
      <Ionicons name={icon} size={16} color="#1c1917" />
      <Text className="text-sm font-semibold text-stone-900 dark:text-white">{label}</Text>
    </TouchableOpacity>
  );
}

function UploadingTile({ progress }: { progress: number }) {
  return (
    <View
      className="items-center justify-center rounded-lg bg-stone-200 dark:bg-stone-700"
      style={{ width: 96, height: 96 }}
    >
      <ActivityIndicator />
      <Text className="mt-1 text-xs text-stone-600 dark:text-stone-300">
        {Math.round(progress)}%
      </Text>
    </View>
  );
}
