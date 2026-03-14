import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

import { Avatar, type Avatar as AvatarType } from '@/kernel/ui/avatar';
import { Button } from '@/kernel/ui/button';
import { Text } from '@/kernel/ui/text';

export function AvatarEditSection({
  currentAvatar,
  previewUrl,
  initials,
  onPress,
  isUploading,
  hasUploaded,
  error,
  disabled,
}: {
  currentAvatar?: AvatarType;
  previewUrl?: string;
  initials: string;
  onPress: () => void;
  isUploading: boolean;
  hasUploaded: boolean;
  error?: Error;
  disabled?: boolean;
}) {
  const avatarData = previewUrl
    ? { largeUrl: previewUrl, mediumUrl: previewUrl, smallUrl: previewUrl, thumbUrl: previewUrl }
    : currentAvatar;

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
        {hasUploaded || currentAvatar ? 'Изменить фото' : 'Добавить фото'}
      </Button>
      {error && <Text className="text-sm text-red-500">{error.message}</Text>}
    </View>
  );
}
