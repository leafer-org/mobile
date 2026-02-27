import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

import { Avatar } from '@/kernel/ui/avatar';
import { Button } from '@/kernel/ui/button';
import { Text } from '@/kernel/ui/text';

export function AvatarUploadSection({
  preview,
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
  preview?: Avatar;
}) {
  return (
    <View className="items-center py-4 gap-3">
      <TouchableOpacity onPress={onPress} disabled={isUploading || disabled}>
        <Avatar size="xl" initials={initials || '?'} avatar={preview} />
        {isUploading && (
          <View className="absolute inset-0 items-center justify-center bg-black/50 rounded-full">
            <ActivityIndicator color="white" />
          </View>
        )}
      </TouchableOpacity>
      <Button variant="ghost" onPress={onPress} disabled={isUploading || disabled}>
        {hasUploaded ? 'Изменить фото' : 'Добавить фото'}
      </Button>
      {error && <Text className="text-red-500 text-sm">{error.message}</Text>}
    </View>
  );
}
