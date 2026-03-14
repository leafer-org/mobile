import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

import { Avatar } from '@/kernel/ui/avatar';
import { Button } from '@/kernel/ui/button';
import { Text } from '@/kernel/ui/text';

export function AvatarUploadSection({
  previewUrl,
  initials,
  onPress,
  isUploading,
  hasUploaded,
  error,
  disabled,
}: {
  initials: string;
  onPress: () => void;
  isUploading: boolean;
  hasUploaded: boolean;
  error?: Error;
  disabled?: boolean;
  previewUrl?: string;
}) {
  const avatarData = previewUrl
    ? { largeUrl: previewUrl, mediumUrl: previewUrl, smallUrl: previewUrl, thumbUrl: previewUrl }
    : undefined;

  return (
    <View className="items-center gap-3 py-4">
      <TouchableOpacity onPress={onPress} disabled={isUploading || disabled}>
        <Avatar size="xl" initials={initials || '?'} avatar={avatarData} />
        {isUploading && (
          <View className="absolute inset-0 items-center justify-center rounded-full bg-black/50">
            <ActivityIndicator color="white" />
          </View>
        )}
      </TouchableOpacity>
      <Button variant="ghost" onPress={onPress} disabled={isUploading || disabled}>
        {hasUploaded ? 'Изменить фото' : 'Добавить фото'}
      </Button>
      {error && <Text className="text-sm text-red-500">{error.message}</Text>}
    </View>
  );
}
