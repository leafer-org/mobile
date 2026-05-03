import { Image, TouchableOpacity, View } from 'react-native';

import { Text } from '@/kernel/ui/text';

export type OrganizationListItemProps = {
  name: string;
  description: string;
  avatarUrl: string | null;
  isOwner: boolean;
  isPublished: boolean;
  draftStatus: 'draft' | 'moderation-request' | 'rejected';
  onPress?: () => void;
};

const STATUS_LABEL: Record<OrganizationListItemProps['draftStatus'], string> = {
  draft: 'Черновик',
  'moderation-request': 'На модерации',
  rejected: 'Отклонено',
};

function getInitial(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed[0].toUpperCase() : '?';
}

export function OrganizationListItem({
  name,
  description,
  avatarUrl,
  isOwner,
  isPublished,
  draftStatus,
  onPress,
}: OrganizationListItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-start gap-3 rounded-xl border border-stone-200 dark:border-stone-700 p-4"
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          className="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-700"
          resizeMode="cover"
        />
      ) : (
        <View className="w-12 h-12 rounded-full bg-stone-300 dark:bg-stone-700 items-center justify-center">
          <Text className="text-stone-700 dark:text-stone-200 font-semibold">
            {getInitial(name)}
          </Text>
        </View>
      )}
      <View className="flex-1 gap-1">
        <Text variant="h3" numberOfLines={1}>
          {name}
        </Text>
        {description.length > 0 && (
          <Text variant="caption" numberOfLines={2}>
            {description}
          </Text>
        )}
        <View className="flex-row gap-2 mt-1">
          {isPublished ? (
            <Text variant="caption" color="success">
              Опубликована
            </Text>
          ) : (
            <Text variant="caption" color="secondary">
              {STATUS_LABEL[draftStatus]}
            </Text>
          )}
          {isOwner && (
            <Text variant="caption" color="secondary">
              · Владелец
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
